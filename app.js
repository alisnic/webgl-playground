import ResourceManager from "./lib/resource_manager.js";
import ShaderLoader from "./lib/shader_loader.js";
import Program from "./lib/program.js";
import Renderer from "./lib/renderer.js";

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
      .attachShader(fragmentShader);

    var shaderProg = program.compile();
    var aPositionLoc = program.getAttribLocation("a_position");
    var aryVerts = new Float32Array([0, 0, 0]);
    var bufVerts = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
    gl.useProgram(shaderProg);
    program.set("uPointSize", 50.0);

    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);

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
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, 1);
    });
  });
}
