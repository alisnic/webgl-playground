export default class Program {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   */
  constructor(gl) {
    this.gl = gl;
    this.shaders = [];
    this.storedLocations = {};
  }

  attachShader(shader) {
    this.shaders.push(shader);
    return this;
  }

  uniforms(mapping) {
    this.uniformsMapping = mapping;
    return this;
  }

  getAttribLocation(name) {
    return this.gl.getAttribLocation(this.shaderProgram, name);
  }

  // getUniformLocation(name) {
  //   return this.gl.getUniformLocation(this.shaderProgram, name);
  // }

  loadLocations() {
    for (var key in this.uniformsMapping) {
      this.storedLocations[key] = this.gl.getUniformLocation(this.shaderProgram, key);
    }
  }

  set(variable, value) {
    if (!this.uniformsMapping[variable]) {
      throw new Error("bad variable name");
    }

    var glFunction = this.uniformsMapping[variable];
    var location = this.storedLocations[variable];
    this.gl[glFunction](location, value);
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

    // gl.detachShader(prog,vShader);
    // gl.detachShader(prog,fShader);
    this.shaders.forEach((shader) => this.gl.deleteShader(shader));
    this.shaderProgram = prog;
    this.loadLocations();
    return prog;
  }
}
