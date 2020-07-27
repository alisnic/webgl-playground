import ResourceManager from "./lib/resource_manager.js";
import ShaderLoader from "./lib/shader_loader.js";
import Program from "./lib/program.js";
import Renderer from "./lib/renderer.js";
import Grid from "./src/grid.js";
import { vec4 } from "https://unpkg.com/gl-matrix@3.3.0/esm/index.js";
import Mesh from "./lib/Mesh.js";

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
export default function run(gl) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  setCanvasSize(gl, 500, 500);

  manager.loadAll().then(() => {
    var loader = new ShaderLoader(gl);
    var vertexShader = loader.loadVertex(manager.data.point_vertex);
    var fragmentShader = loader.loadFragment(manager.data.point_fragment);

    var program = new Program(gl)
      .uniforms({ uColor: "uniform3fv" })
      .attachShader(vertexShader)
      .attachShader(fragmentShader)
      .activate()
      .set("uColor", [0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]);

    // var grid = new Grid(program);
    var grid = new Mesh(program, gl.LINES)
      .setData(Grid.build())
      .setComponentSize(4)
      .enableAttributes({
        a_position: {
          size: 3,
          type: "FLOAT",
          stride: Float32Array.BYTES_PER_ELEMENT * 4,
        },
        a_color: {
          size: 1,
          type: "FLOAT",
          stride: Float32Array.BYTES_PER_ELEMENT * 4,
          offset: Float32Array.BYTES_PER_ELEMENT * 3,
        },
      });

    new Renderer({ fps: 0 }).render((dt) => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // grid.render();
      var vertexCount = grid.dataSize / grid.componentSize;
      gl.drawArrays(gl.LINES, 0, vertexCount);
    });
  });
}
