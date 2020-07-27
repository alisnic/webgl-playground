export default class Shader {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   */
  constructor(gl) {
    this.gl = gl;
    this.shaders = [];
    this.storedLocations = {};
  }

  activate() {
    if (!this.shaderProgram) {
      this.compile();
    }
    this.gl.useProgram(this.shaderProgram);
    return this;
  }

  attachShader(shader) {
    this.shaders.push(shader);
    return this;
  }

  uniforms(mapping) {
    this.uniformsMapping = mapping;
    return this;
  }

  getAttributeLocation(name) {
    return this.gl.getAttribLocation(this.shaderProgram, name);
  }

  renderModel(model) {
    this.set("uMVMatrix", false, model.transform.getViewMatrix()); //Set the transform, so the shader knows where the modal exists in 3d space
    // this.gl.bindVertexArray(model.mesh.vao);
    // if (modal.mesh.indexCount)
    //   this.gl.drawElements(
    //     modal.mesh.drawMode,
    //     modal.mesh.indexLength,
    //     gl.UNSIGNED_SHORT,
    //     0
    //   );
    // else
    this.gl.drawArrays(model.mesh.drawMode, 0, model.mesh.getVertexCount());
    // this.gl.bindVertexArray(null);
    return this;
  }

  loadLocations() {
    for (var key in this.uniformsMapping) {
      this.storedLocations[key] = this.gl.getUniformLocation(this.shaderProgram, key);
    }
  }

  set(variable, ...args) {
    if (!this.uniformsMapping[variable]) {
      throw new Error("bad variable name");
    }

    var glFunction = this.uniformsMapping[variable];
    var location = this.storedLocations[variable];
    this.gl[glFunction](location, ...args);
    return this;
  }

  compile() {
    var prog = this.gl.createProgram();
    this.shaders.forEach((shader) => this.gl.attachShader(prog, shader));
    this.gl.linkProgram(prog);

    if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
      console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
      this.gl.deleteProgram(prog);
      return null;
    }

    this.gl.validateProgram(prog);

    if (!this.gl.getProgramParameter(prog, this.gl.VALIDATE_STATUS)) {
      console.error("Error validating program", this.gl.getProgramInfoLog(prog));
      this.gl.deleteProgram(prog);
      return null;
    }

    this.shaders.forEach((shader) => this.gl.deleteShader(shader));
    this.shaderProgram = prog;
    this.loadLocations();
    return prog;
  }
}
