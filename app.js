import Renderer from "./lib/renderer.js";
import Grid from "./src/grid.js";
import GridShader from "./src/GridShader.js";

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
  setCanvasSize(gl, 500, 500);

  var shader = new GridShader(gl);

  var model = Grid.buildModel(shader)
    .setScale(0.4, 0.4, 0.4)
    .setRotation(0, 0, 45)
    .setPosition(0.8, 0.8, 0);

  new Renderer({ fps: 30 }).render((dt) => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var p = model.transform.position, //Just an pointer to transform position, make code smaller
      angle = Math.atan2(p.y, p.x) + 1 * dt, //Calc the current angle plus 1 degree per second rotation
      radius = Math.sqrt(p.x * p.x + p.y * p.y), //Calc the distance from origin.
      scale = Math.max(0.2, Math.abs(Math.sin(angle)) * 1.2); //Just messing with numbers and seeing what happens :)

    shader.renderModel(
      model
        .setScale(scale, scale / 4, 1)
        .setPosition(radius * Math.cos(angle), radius * Math.sin(angle), 0)
        .addRotation(30 * dt, 60 * dt, 15 * dt)
        .preRender()
    );
  });
}
