import Renderer from "./lib/renderer.js";
import Grid from "./src/grid.js";
import GridShader from "./src/GridShader.js";
import Camera from "./lib/Camera.js";
import CameraController from "./lib/CameraController.js";
import Platform from "./lib/Platform.js";
import Quad from "./src/Quad.js";
import QuadShader from "./src/QuadShader.js";

/**
 * @param {WebGLRenderingContext} gl - WebGL instance
 */
export default function run(gl) {
  gl.cullFace(gl.BACK); //Back is also default
  gl.frontFace(gl.CCW); //Dont really need to set it, its ccw by default.
  gl.enable(gl.DEPTH_TEST); //Shouldn't use this, use something else to add depth detection
  gl.enable(gl.CULL_FACE); //Cull back face, so only show triangles that are created clockwise
  gl.depthFunc(gl.LEQUAL); //Near things obscure far things
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); //Setup default alpha blending
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  Platform.setCanvasSize(gl, innerWidth, innerHeight);

  var gCamera = new Camera(gl);
  gCamera.transform.position.set(0, 1, 3);
  var gCameraCtrl = new CameraController(gl, gCamera);

  //Setup Grid
  var gGridShader = new GridShader(gl, gCamera.projectionMatrix);
  var gGridModal = Grid.buildModel(gGridShader, true);

  var gShader = new QuadShader(gl, gCamera.projectionMatrix);
  var gModal = Quad.buildModel(gShader);

  new Renderer({ fps: 60 }).render((dt) => {
    gCamera.updateViewMatrix();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gGridShader
      .activate()
      .setCameraMatrix(gCamera.viewMatrix)
      .renderModel(gGridModal.preRender());

    gShader
      .activate()
      .setCameraMatrix(gCamera.viewMatrix)
      .renderModel(gModal.preRender());
  });
}
