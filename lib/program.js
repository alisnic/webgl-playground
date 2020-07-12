export default class Program {
  constructor(gl) {
    this.gl = gl
    this.shaders = []
  }

  attachShader(shader) {
    this.shaders.push(shader)
    return this
  }

  getAttribLocation(name) {
    return this.gl.getAttribLocation(this.shaderProgram, name);
  }

  getUniformLocation(name) {
    return this.gl.getUniformLocation(this.shaderProgram, name)
  }

  compile() {
    var prog = this.gl.createProgram()
    this.shaders.forEach(shader => this.gl.attachShader(prog, shader))
    this.gl.linkProgram(prog)

    if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)){
      console.error("Error creating shader program.",gl.getProgramInfoLog(prog));
      this.gl.deleteProgram(prog);
      return null;
    }

    this.gl.validateProgram(prog);

    if (!this.gl.getProgramParameter(prog, this.gl.VALIDATE_STATUS)){
      console.error("Error validating program", this.gl.getProgramInfoLog(prog));
      this.gl.deleteProgram(prog);
      return null;
    }

    // gl.detachShader(prog,vShader);
    // gl.detachShader(prog,fShader);
    this.shaders.forEach(shader => this.gl.deleteShader(shader))

    this.shaderProgram = prog;
    return prog;
  }
}