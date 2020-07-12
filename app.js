/// <reference path="webgl.d.ts" />

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
      .attachShader(vertexShader)
      .attachShader(fragmentShader);

    var shaderProg = program.compile();

    var aPositionLoc = program.getAttribLocation("a_position"),
      uPointSizeLoc = program.getUniformLocation("uPointSize");

    //............................................
    //Set Up Data Buffers
    var aryVerts = new Float32Array([0, 0, 0, 0.5, 0.5, 0]),
      bufVerts = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts);
    gl.bufferData(gl.ARRAY_BUFFER, aryVerts, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //............................................
    //Set Up For Drawing
    gl.useProgram(shaderProg); //Activate the Shader
    gl.uniform1f(uPointSizeLoc, 50.0); //Store data to the shader's uniform variable uPointSize

    //how its down without VAOs
    gl.bindBuffer(gl.ARRAY_BUFFER, bufVerts); //Tell gl which buffer we want to use at the moment
    gl.enableVertexAttribArray(aPositionLoc); //Enable the position attribute in the shader
    gl.vertexAttribPointer(aPositionLoc, 3, gl.FLOAT, false, 0, 0); //Set which buffer the attribute will pull its data from
    gl.bindBuffer(gl.ARRAY_BUFFER, null); //Done setting up the buffer

    gl.drawArrays(gl.POINTS, 0, 2); //Draw the points

    new Renderer({ fps: 30 }).render(() => {
      console.log("RENDER!");
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      aryVerts[0] = Math.random();
      aryVerts[1] = Math.random();
      aryVerts[3] = Math.random();
      aryVerts[4] = Math.random();
      gl.drawArrays(gl.POINTS, 0, 2); //Draw the points
    });
  });
}
