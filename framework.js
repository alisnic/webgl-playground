// Shader(
//   src,
//   type,
//   status
// )
//
// Program(
//   shader1,
//   shader2,
//   attribute1,
//   uniform1
// )
//
// Kernel(
//   setViewPortSize()
// )

class ShaderLoader {
  constructor(gl) {
    this.gl = gl
  }

  static domSource(elementId) {
    return document.getElementById(elementId).text
  }

  loadVertex(src) {
    return this.load(src, this.gl.VERTEX_SHADER)
  }

  loadFragment(src) {
    return this.load(src, this.gl.FRAGMENT_SHADER)
  }

  load(src, type) {
    var shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error("Error compiling shader : " + src, this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}

class Program {
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

class ResourceManager {
  constructor (map) {
    this.map = map;
    this.data = {}
  }

  loadAll() {
    var promises = []
    var keys = Object.keys(this.map)
    var promises = keys.map(key => fetch(this.map[key]))

    return Promise.all(promises)
      .then(responses => Promise.all(responses.map(r => r.text())))
      .then(payloads => {
        payloads.forEach((data, index)=> {
          this.data[keys[index]] = data
        })
      })
  }
}

class Kernel {
  constructor(gl) {
    this.gl = gl
  }

  useProgram(shaderProgram) {
    this.shaderProgram = shaderProgram
    this.gl.useProgram(shaderProgram)
    return this
  }
}
