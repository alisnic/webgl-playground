export default class Mesh {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   */
  constructor(program, drawMode) {
    this.program = program;
    this.gl = program.gl;
    this.buffer = this.gl.createBuffer();
    this.drawMode = drawMode;
  }

  setComponentSize(size) {
    this.componentSize = size;
    return this;
  }

  setData(data, dataType, mode) {
    this.dataSize = data.length;

    if (!dataType) {
      dataType = this.gl.ARRAY_BUFFER;
    }

    if (!mode) {
      mode = this.gl.STATIC_DRAW;
    }

    this.gl.bindBuffer(dataType, this.buffer);
    var array = new Float32Array(data);
    this.gl.bufferData(dataType, array, mode);
    return this;
  }

  enableAttributes(attributes) {
    for (var key in attributes) {
      var definition = attributes[key];
      var location = this.program.getAttributeLocation(key);
      this.gl.enableVertexAttribArray(location);

      this.gl.vertexAttribPointer(
        location,
        definition.size,
        this.gl[definition.type],
        definition.normalized || false,
        definition.stride || 0,
        definition.offset || 0
      );
    }

    return this;
  }
}
