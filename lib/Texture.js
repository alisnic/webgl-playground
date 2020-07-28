export default class Texture {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   * @param {ImageData} img - image tag
   * @param {boolean} doYFlip - flip the image vertically or not
   */
  static loadFromImageTag(gl, img, doYFlip = false) {
    if (!img) {
      throw new Error("wrong image tag!");
    }

    var tex = gl.createTexture();

    if (doYFlip == true) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_NEAREST
    );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

    if (doYFlip == true) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    return tex;
  }
}
