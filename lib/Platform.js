export default class Platform {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   * @param {number} width
   * @param {number} height
   */
  static setCanvasSize(gl, width, height) {
    gl.canvas.style.width = width + "px";
    gl.canvas.style.height = height + "px";
    gl.canvas.width = width;
    gl.canvas.height = height;

    gl.viewport(0, 0, width, height);
  }
}
