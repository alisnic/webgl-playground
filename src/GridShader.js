import Shader from "../lib/Shader.js";
import ShaderLoader from "../lib/shader_loader.js";

export default class GridShader extends Shader {
  static VERTEX_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : vert
    in vec3 a_position;
    in float a_color;

    uniform mat4 uMVMatrix; 
    uniform vec3 uColor[4];

    out lowp vec4 color;

    void main(void){
      color = vec4(uColor[ int(a_color) ],1.0);
      gl_Position = uMVMatrix * vec4(a_position, 1.0);
    }`;

  static FRAGMENT_SRC = `#version 300 es
  #pragma vscode_glsllint_stage : frag
  precision mediump float;
  
  in vec4 color;
  out vec4 finalColor;
  
  void main(void){ finalColor = color; }`;

  constructor(gl) {
    super(gl);

    var loader = new ShaderLoader(gl);
    var vertexShader = loader.loadVertex(GridShader.VERTEX_SRC);
    var fragmentShader = loader.loadFragment(GridShader.FRAGMENT_SRC);

    this.uniforms({ uColor: "uniform3fv", uMVMatrix: "uniformMatrix4fv" });
    this.attachShader(vertexShader);
    this.attachShader(fragmentShader);
    this.activate();
    this.set("uColor", [0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }
}
