export default class Mesh {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   */
  constructor(program) {
    this.program = program;
    this.gl = program.gl;
    this.vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vertexArray);
  }

  setComponentSize(size) {
    this.componentSize = size;
    return this;
  }

  addVerts(data, options = {}) {
    if (!data) throw new Error("no data");

    this.vertexBuffer = this.gl.createBuffer();
    this.vertexComponentSize = options.componentSize || 3;
    this.vertexCount = data.length / this.vertexComponentSize;

    var dataType = options.dataType || this.gl.ARRAY_BUFFER;
    var memoryHint = options.memoryHint || this.gl.STATIC_DRAW;
    var positionDataType = options.positionDataType || this.gl.FLOAT;
    var positionStride = options.positionStride || 0;
    var positionOffset = options.positionOffset || 0;

    this.gl.bindBuffer(dataType, this.vertexBuffer);
    this.gl.bufferData(dataType, new Float32Array(data), memoryHint); //then push array into it.

    this.bindAttribute(options.positionAttributeName || "a_position", {
      size: this.vertexComponentSize,
      type: positionDataType,
      stride: positionStride,
      offset: positionOffset,
    });

    return this;
  }

  addIndices(data, options = {}) {
    if (!data) throw new Error("no data");

    this.indexBuffer = this.gl.createBuffer();
    this.indexCount = data.length;
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      options.memoryHint || this.gl.STATIC_DRAW
    );

    return this;
  }

  addUVs(data, options = {}) {
    if (!data) throw new Error("no data");

    this.uvBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.uvBuffer);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(data),
      options.memoryHint || this.gl.STATIC_DRAW
    );

    var attributeName = options.attributeName || "a_uv";
    this.bindAttribute(attributeName, { size: 2, type: this.gl.FLOAT });
    return this;
  }

  addNormals(data, options = {}) {
    if (!data) throw new Error("no data");

    this.normBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normBuffer);

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(data),
      options.memoryHint || this.gl.STATIC_DRAW
    );

    var attributeName = options.attributeName || "a_norm";
    this.bindAttribute(attributeName, { size: 3, type: this.gl.FLOAT });
    return this;
  }

  bindAttribute(name, definition) {
    var location = this.program.getAttributeLocation(name);

    if (location == -1) {
      throw new Error(`cannot get attribute ${name} location`);
    }

    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(
      location,
      definition.size,
      definition.type,
      definition.normalized || false,
      definition.stride || 0,
      definition.offset || 0
    );

    return this;
  }
}
