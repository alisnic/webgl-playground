export default class ShaderLoader {
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