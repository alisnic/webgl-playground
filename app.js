import Renderer from "./lib/renderer.js";
import Grid from "./src/grid.js";
import GridShader from "./src/GridShader.js";
import Camera from "./lib/Camera.js";
import CameraController from "./lib/CameraController.js";
import Platform from "./lib/Platform.js";
import Texture from "./lib/Texture.js";
import Cube from "./src/Cube.js";
import CubeShader from "./src/CubeShader.js";
import SkymapShader from "./src/SkymapShader.js";

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
  gShader.addTexture("uMainTex", texture, gl.TEXTURE_2D);
  gModal.setPosition(0, 0.6, 0);

  var skybox1 = Texture.loadCubeMap(gl, [
    document.getElementById("cube01_right"),
    document.getElementById("cube01_left"),
    document.getElementById("cube01_top"),
    document.getElementById("cube01_bottom"),
    document.getElementById("cube01_back"),
    document.getElementById("cube01_front"),
  ]);

  var skybox2 = Texture.loadCubeMap(gl, [
    document.getElementById("cube02_right"),
    document.getElementById("cube02_left"),
    document.getElementById("cube02_top"),
    document.getElementById("cube02_bottom"),
    document.getElementById("cube02_back"),
    document.getElementById("cube02_front"),
  ]);

  var gSkyMapShader = new SkymapShader(gl, gCamera.projectionMatrix);
  gSkyMapShader.addTexture("uDayTex", skybox1, gl.TEXTURE_CUBE_MAP);
  gSkyMapShader.addTexture("uNightTex", skybox2, gl.TEXTURE_CUBE_MAP);

  var gSkymap = Cube.buildModel(gSkyMapShader, {
    size: 10,
    uvs: false,
    normals: false,
  });

  var fps = debug ? 0 : 60;
  var renderer = new Renderer(gl, { camera: gCamera, fps: fps });
  renderer.init(gl).onEachFrame((dt) => {
    gCamera.updateViewMatrix();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderer.render(gSkyMapShader, gSkymap);
    renderer.render(gGridShader, gGridModal);
    renderer.render(gShader, gModal);
  });
}
