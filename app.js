import Renderer from "./lib/renderer.js";
import Grid from "./src/grid.js";
import GridShader from "./src/GridShader.js";
import Camera from "./lib/Camera.js";
import CameraController from "./lib/CameraController.js";
import Platform from "./lib/Platform.js";
import Texture from "./lib/Texture.js";
import Cube from "./src/Cube.js";
import CubeShader from "./src/CubeShader.js";

/**
 * @param {WebGLRenderingContext} gl - WebGL instance
 */
export default function run(gl, debug) {
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
  var gGridModal = Grid.buildModel(gGridShader, false);

  var gShader = new CubeShader(gl, gCamera.projectionMatrix);
  var gModal = Cube.buildModel(gShader);

  gModal.setPosition(0, 0.6, 0);
  gModal.setTexture(texture);

  var fps = debug ? 0 : 60;
  var renderer = new Renderer(gl, { camera: gCamera, fps: fps });
  renderer.init(gl).onEachFrame((dt) => {
    gCamera.updateViewMatrix();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderer.render(gGridShader, gGridModal);
    renderer.render(gShader, gModal);
  });
}
