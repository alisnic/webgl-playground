export default class Kernel {
  constructor(gl) {
    this.gl = gl;
  }

  createArrayBuffer(data, mode) {
    if (!mode) {
      mode = this.gl.STATIC_DRAW;
    }

    var aryVerts = new Float32Array(data);
    var bufVerts = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufVerts);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, aryVerts, mode);
  }

  redraw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.POINTS, 0, 1);
  }
}
