export default class Shader {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   */
  constructor(gl) {
    this.gl = gl;
    this.shaders = [];
    this.storedLocations = {};
    this.loadShader(this.constructor.VERTEX_SRC, gl.VERTEX_SHADER);
    this.loadShader(this.constructor.FRAGMENT_SRC, gl.FRAGMENT_SHADER);
  }

  activate() {
    if (!this.shaderProgram) {
      this.compile();
    }
    this.gl.useProgram(this.shaderProgram);
    return this;
  }

  loadShader(src, type) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "Error compiling shader : " + src,
        this.gl.getShaderInfoLog(shader)
      );
      this.gl.deleteShader(shader);
      return null;
    }

    this.shaders.push(shader);
  }

  hasUniform(name) {
    return this.uniformsMapping.hasOwnProperty(name);
  }

  uniforms(mapping) {
    this.uniformsMapping = mapping;
    return this;
  }

  getAttributeLocation(name) {
    return this.gl.getAttribLocation(this.shaderProgram, name);
  }

  loadLocations() {
    for (var key in this.uniformsMapping) {
      this.storedLocations[key] = this.gl.getUniformLocation(
        this.shaderProgram,
        key
      );
    }
  }

  useTexture(glTexture) {
    if (!glTexture) {
      throw new Error("texture is null!");
    }

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
    this.set("uMainTex", 0);
    return this;
  }

  set(variable, ...args) {
    if (!this.uniformsMapping[variable]) {
      throw new Error(`bad variable name ${variable}`);
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
      console.error(
        "Error creating shader program.",
        gl.getProgramInfoLog(prog)
      );
      this.gl.deleteProgram(prog);
      return null;
    }

    this.gl.validateProgram(prog);

    if (!this.gl.getProgramParameter(prog, this.gl.VALIDATE_STATUS)) {
      console.error(
        "Error validating program",
        this.gl.getProgramInfoLog(prog)
      );
      this.gl.deleteProgram(prog);
      return null;
    }

    this.shaders.forEach((shader) => this.gl.deleteShader(shader));
    this.shaderProgram = prog;
    this.loadLocations();
    return prog;
  }
}
