import ResourceManager from "./lib/resource_manager.js";
import ShaderLoader from "./lib/shader_loader.js";
import Program from "./lib/program.js";
import Renderer from "./lib/renderer.js";
import Kernel from "./lib/kernel.js";

var manager = new ResourceManager({
  point_vertex: "shaders/point.vert",
  point_fragment: "shaders/point.frag",
});

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
export default function run(gl, tickFn) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  setCanvasSize(gl, 500, 500);

  manager.loadAll().then(() => {
    var loader = new ShaderLoader(gl);
    var vertexShader = loader.loadVertex(manager.data.point_vertex);
    var fragmentShader = loader.loadFragment(manager.data.point_fragment);

    var program = new Program(gl)
      .uniforms({ uPointSize: "uniform1f", uAngle: "uniform1f" })
      .attachShader(vertexShader)
      .attachShader(fragmentShader)
      .activate();

    var kernel = new Kernel(gl);
    kernel.createArrayBuffer([0, 0, 0]);

    program.set("uPointSize", 50.0);
    program.enableVertexArray("a_position", 3, gl.FLOAT);

    var gPointSize = 0,
      gPSizeStep = 3,
      gAngle = 0,
      gAngleStep = (Math.PI / 180.0) * 90; //90 degrees in Radians

    new Renderer({ fps: 30 }).render((dt) => {
      gPointSize += (gPSizeStep * dt) / 1000;
      var size = Math.sin(gPointSize) * 10.0 + 30.0;
      program.set("uPointSize", size);

      gAngle += (gAngleStep * dt) / 1000;
      program.set("uAngle", gAngle);
      kernel.redraw();
    });
  });
}
