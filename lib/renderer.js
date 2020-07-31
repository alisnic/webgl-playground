export default class Renderer {
  constructor(gl, options = {}) {
    this.options = options;
    this.gl = gl;
    this.camera = options.camera;
  }

  init() {
    this.gl.cullFace(this.gl.BACK); //Back is also default
    this.gl.frontFace(this.gl.CCW); //Dont really need to set it, its ccw by default.
    this.gl.enable(this.gl.DEPTH_TEST); //Shouldn't use this, use something else to add depth detection
    this.gl.enable(this.gl.CULL_FACE); //Cull back face, so only show triangles that are created clockwise
    this.gl.depthFunc(this.gl.LEQUAL); //Near things obscure far things
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); //Setup default alpha blending
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    window.gl = this.gl;
    return this;
  }

  render(shader, model) {
    shader.activate();

    if (shader.hasUniform("uTime")) {
      shader.set("uTime", performance.now());
    }

    if (model.texture) {
      shader.useTexture(model.texture);
    }

    model.preRender();
    shader.preRender();

    if (this.camera) {
      shader.updateCamera(this.camera);
      shader.set("uMVMatrix", false, model.transform.getViewMatrix());
    }

    this.gl.bindVertexArray(model.mesh.vertexArray);

    if (!model.culling) {
      this.gl.disable(this.gl.CULL_FACE);
    }

    if (model.blending) {
      this.gl.enable(this.gl.BLEND);
    }

    if (model.mesh.indexBuffer) {
      this.gl.drawElements(
        model.drawMode,
        model.mesh.indexCount,
        this.gl.UNSIGNED_SHORT,
        0
      );
      this.gl.bindVertexArray(null);
    } else {
      this.gl.drawArrays(model.drawMode, 0, model.mesh.vertexCount);
    }

    if (!model.culling) {
      this.gl.enable(this.gl.CULL_FACE);
    }

    if (model.blending) {
      this.gl.disable(this.gl.BLEND);
    }

    // shader.deactivate();
    return this;
  }

  onEachFrame(fn) {
    if (this.options.fps == 0) {
      return fn(1000);
    }

    var fpsInterval = 1000 / this.options.fps;
    var previousRenderAt = performance.now();
    var elapsed = 1000;

    var tickFn = () => {
      elapsed = performance.now() - previousRenderAt;

      if (elapsed > fpsInterval) {
        fn(elapsed / 1000);
        previousRenderAt = performance.now();
      }

      requestAnimationFrame(tickFn);
    };

    requestAnimationFrame(tickFn);
  }
}
