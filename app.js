import Renderer from "./lib/renderer.js";
import Grid from "./src/grid.js";
import GridShader from "./src/GridShader.js";
import Camera from "./lib/Camera.js";
import CameraController from "./lib/CameraController.js";
import Platform from "./lib/Platform.js";
import Quad from "./src/Quad.js";
import QuadShader from "./src/QuadShader.js";
import Texture from "./lib/Texture.js";
import TextureShader from "./src/TextureShader.js";

/**
 * @param {WebGLRenderingContext} gl - WebGL instance
 */
export default function run(gl) {
  Platform.setCanvasSize(gl, innerWidth, innerHeight);

  var gCamera = new Camera(gl);
  gCamera.transform.position.set(0, 1, 3);
  var gCameraCtrl = new CameraController(gl, gCamera);

  var texture = Texture.loadFromImageTag(
    gl,
    document.getElementById("texture")
  );

  //Setup Grid
  var gGridShader = new GridShader(gl, gCamera.projectionMatrix);
  var gGridModal = Grid.buildModel(gGridShader, true);

  var gShader = new TextureShader(gl, gCamera.projectionMatrix);
  var gModal = Quad.buildModel(gShader).setPosition(0, 0.6, 0);

  var renderer = new Renderer({ fps: 60 });
  renderer.init(gl).render((dt) => {
    gCamera.updateViewMatrix();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gGridShader
      .activate()
      .setCameraMatrix(gCamera.viewMatrix)
      .renderModel(gGridModal.preRender());

    gShader
      .activate()
      .useTexture(texture)
      .setCameraMatrix(gCamera.viewMatrix)
      .renderModel(gModal.preRender());
  });
}
