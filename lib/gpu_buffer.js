export default class GpuBuffer {
  constructor(gl, dataType) {
    this.gl = gl;
    this.glBuffer = this.gl.createBuffer();
    this.dataType = dataType;
  }

  activate() {
    this.gl.bindBuffer(this.dataType, this.glBuffer);
    return this;
  }

  loadData(data, mode) {
    var array = new Float32Array(data);
    this.gl.bufferData(this.dataType, array, mode);
    return this;
  }
}
