/// <reference path="webgl.d.ts" />

import ResourceManager from "./lib/resource_manager.js";
import ShaderLoader from "./lib/shader_loader.js";
import Program from "./lib/program.js";
import Renderer from "./lib/renderer.js";
import Entity from "./lib/entity.js";
import Mover from "./lib/mover.js";

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

    var program = new Program(gl).attachShader(vertexShader).attachShader(fragmentShader);

    var shaderProg = program.compile();

    var aPositionLoc = program.getAttribLocation("a_position"),
      uPointSizeLoc = program.getUniformLocation("uPointSize");

    var square1 = new Entity("square1", { x: Math.random(), y: Math.random() });
    var square2 = new Entity("square2", { x: Math.random(), y: Math.random() });

    var aryVerts = new Float32Array([
      square1.data.x,
      square1.data.y,
      0,
      square2.data.x,
      square2.data.y,
      0,
    ]);

    var bufVerts = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);

    gl.useProgram(shaderProg);
    gl.uniform1f(uPointSizeLoc, 50.0);

    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0);

    var mover = new Mover().register(square1).register(square2);

    new Renderer({ fps: 30 }).render(() => {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      mover.commit();

      aryVerts[0] = square1.data.x;
      aryVerts[1] = square1.data.y;
      aryVerts[3] = square2.data.x;
      aryVerts[4] = square2.data.y;

      gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.POINTS, 0, 2);
    });
  });
}
