import Shader from "../lib/Shader.js";
import ShaderLoader from "../lib/shader_loader.js";

export default class GridShader extends Shader {
  static VERTEX_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : vert
    in vec3 a_position;
    in float a_color;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;

		uniform vec3 uColor[4];	//Color Array
		out lowp vec4 color;	//Color to send to fragment shader.
		
		void main(void){
			color = vec4(uColor[ int(a_color) ],1.0); //Using the 4th float as a color index.
			gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);
    }`;

  static FRAGMENT_SRC = `#version 300 es
  #pragma vscode_glsllint_stage : frag
  precision mediump float;
  
  in vec4 color;
  out vec4 finalColor;
  
  void main(void){ finalColor = color; }`;

  constructor(gl, projectionMatrix) {
    super(gl);

    var loader = new ShaderLoader(gl);
    var vertexShader = loader.loadVertex(GridShader.VERTEX_SRC);
    var fragmentShader = loader.loadFragment(GridShader.FRAGMENT_SRC);

    this.uniforms({
      uColor: "uniform3fv",
      uMVMatrix: "uniformMatrix4fv",
      uCameraMatrix: "uniformMatrix4fv",
      uPMatrix: "uniformMatrix4fv",
    });
    this.attachShader(vertexShader);
    this.attachShader(fragmentShader);
    this.activate();
    this.set("uColor", [0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
    this.setPerspective(projectionMatrix);
  }

  renderModel(model) {
    this.set("uMVMatrix", false, model.transform.getViewMatrix());
    super.renderModel(model);
  }

  setPerspective(matData) {
    this.set("uPMatrix", false, matData);
    return this;
  }

  setCameraMatrix(matData) {
    this.set("uCameraMatrix", false, matData);
    return this;
  }
}
