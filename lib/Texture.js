export default class Texture {
  /**
   * @param {WebGLRenderingContext} gl - WebGL instance
   * @param {Array} images - image tag
   */
  static loadCubeMap(gl, images) {
    if (images.length != 6) {
      throw new Error("wrong number of images for a cubemap");
    }

    //Cube Constants values increment, so easy to start with right and just add 1 in a loop
    //To make the code easier costs by making the imgAry coming into the function to have
    //the images sorted in the same way the constants are set.
    //	TEXTURE_CUBE_MAP_POSITIVE_X - Right	:: TEXTURE_CUBE_MAP_NEGATIVE_X - Left
    //	TEXTURE_CUBE_MAP_POSITIVE_Y - Top 	:: TEXTURE_CUBE_MAP_NEGATIVE_Y - Bottom
    //	TEXTURE_CUBE_MAP_POSITIVE_Z - Back	:: TEXTURE_CUBE_MAP_NEGATIVE_Z - Front

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);

    //push image to specific spot in the cube map.
    for (var i = 0; i < 6; i++) {
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        images[i]
      );
    }

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR); //Setup up scaling
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //Setup down scaling
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Stretch image to X position
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Stretch image to Y position
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE); //Stretch image to Z position
    //this.generateMipmap(this.TEXTURE_CUBE_MAP);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    return tex;
  }

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
