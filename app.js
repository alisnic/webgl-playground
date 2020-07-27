import ResourceManager from "./lib/resource_manager.js";
import ShaderLoader from "./lib/shader_loader.js";
import Program from "./lib/program.js";
import Renderer from "./lib/renderer.js";
import GpuBuffer from "./lib/gpu_buffer.js";

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
      .activate();

    var verts = gridData();
    var buffer = new GpuBuffer(gl, gl.ARRAY_BUFFER)
      .activate()
      .loadData(verts, gl.STATIC_DRAW);

    program.set("uColor", [0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]);

    var strideLen = Float32Array.BYTES_PER_ELEMENT * 4;
    program.enableVertexArray("a_position", 3, gl.FLOAT, strideLen);
    program.enableVertexArray(
      "a_color",
      1,
      gl.FLOAT,
      strideLen,
      Float32Array.BYTES_PER_ELEMENT * 3
    );

    var vertexCount = verts.length / 4;

    new Renderer({ fps: 0 }).render((dt) => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.LINES, 0, vertexCount);
    });
  });
}

function gridData() {
  var verts = [],
    size = 1.8, // W/H of the outer box of the grid, from origin we can only go 1 unit in each direction, so from left to right is 2 units max
    div = 10.0, // How to divide up the grid
    step = size / div, // Steps between each line, just a number we increment by for each line in the grid.
    half = size / 2; // From origin the starting position is half the size.

  var p; //Temp variable for position value.
  for (var i = 0; i <= div; i++) {
    //Vertical line
    p = -half + i * step;
    verts.push(p); //x1
    verts.push(half); //y1
    verts.push(0); //z1
    verts.push(0); //c2

    verts.push(p); //x2
    verts.push(-half); //y2
    verts.push(0); //z2
    verts.push(1); //c2

    //Horizontal line
    p = half - i * step;
    verts.push(-half); //x1
    verts.push(p); //y1
    verts.push(0); //z1
    verts.push(0); //c1

    verts.push(half); //x2
    verts.push(p); //y2
    verts.push(0); //z2
    verts.push(1); //c2
  }

  //TODO : Remove the following, its only to demo extra lines can be thrown in.
  verts.push(-half); //x1
  verts.push(-half); //y1
  verts.push(0); //z1
  verts.push(2); //c2

  verts.push(half); //x2
  verts.push(half); //y2
  verts.push(0); //z2
  verts.push(2); //c2

  verts.push(-half); //x1
  verts.push(half); //y1
  verts.push(0); //z1
  verts.push(3); //c2

  verts.push(half); //x2
  verts.push(-half); //y2
  verts.push(0); //z2
  verts.push(3); //c2

  return verts;
}
