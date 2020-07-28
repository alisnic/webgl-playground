export default class Renderer {
  constructor(options) {
    this.options = options;
  }

  init(gl) {
    gl.cullFace(gl.BACK); //Back is also default
    gl.frontFace(gl.CCW); //Dont really need to set it, its ccw by default.
    gl.enable(gl.DEPTH_TEST); //Shouldn't use this, use something else to add depth detection
    gl.enable(gl.CULL_FACE); //Cull back face, so only show triangles that are created clockwise
    gl.depthFunc(gl.LEQUAL); //Near things obscure far things
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //Setup default alpha blending
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    return this;
  }

  render(fn) {
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
