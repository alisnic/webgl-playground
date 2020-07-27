import Renderer from "./lib/renderer.js";
import Grid from "./src/grid.js";
import GridShader from "./src/GridShader.js";
import Camera from "./lib/Camera.js";
import CameraController from "./lib/CameraController.js";

/**
 * @param {WebGLRenderingContext} gl - WebGL instance
 * @param {number} width
 * @param {number} height
 */
function setCanvasSize(gl, width, height) {
  gl.canvas.style.width = width + "px";
  gl.canvas.style.height = height + "px";
  gl.canvas.width = width;
  gl.canvas.height = height;

  gl.viewport(0, 0, width, height);
}

/**
 * @param {WebGLRenderingContext} gl - WebGL instance
 */
export default function run(gl) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  setCanvasSize(gl, innerWidth, innerHeight);

  var gCamera = new Camera(gl);
  gCamera.transform.position.set(0, 1, 3);
  var gCameraCtrl = new CameraController(gl, gCamera);

  //Setup Grid
  var gGridShader = new GridShader(gl, gCamera.projectionMatrix);
  var gGridModal = Grid.buildModel(gGridShader, true);

  new Renderer({ fps: 60 }).render((dt) => {
    gCamera.updateViewMatrix();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gGridShader
      .activate()
      .setCameraMatrix(gCamera.viewMatrix)
      .renderModel(gGridModal.preRender());
  });
}
