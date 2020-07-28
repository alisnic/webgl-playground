import Shader from "../lib/Shader.js";
import ShaderLoader from "../lib/shader_loader.js";

export default class QuadShader extends Shader {
  static VERTEX_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : vert
		in vec3 a_position;	//Standard position data.
		in vec2 a_uv;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;

		out vec2 uv;

		void main(void){
			uv = a_uv;
			gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0); 
		}`;

  static FRAGMENT_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : frag
    precision mediump float;
    in vec2 uv;

    out vec4 finalColor;
    void main(void){
      //Square Border
      float c = (uv.x <= 0.1 || uv.x >=0.9 || uv.y <= 0.1 || uv.y >= 0.9)? 0.0 : 1.0;
      finalColor = vec4(c,c,c,1.0-c);

      //Circle
      /*
      vec2 delta = uv - vec2(0.5,0.5); //delta position from center;
      float dist = 0.5 - sqrt(delta.x*delta.x + delta.y*delta.y);

      float border = 0.01;
      float a = 0.0;
      if(dist > border) a = 1.0;
      else if(dist > 0.0) a = dist / border;

      finalColor = vec4(0.0,0.0,0.0,a);
      */
    }`;

  constructor(gl, projectionMatrix) {
    super(gl);

    var loader = new ShaderLoader(gl);
    var vertexShader = loader.loadVertex(QuadShader.VERTEX_SRC);
    var fragmentShader = loader.loadFragment(QuadShader.FRAGMENT_SRC);

    this.uniforms({
      uMVMatrix: "uniformMatrix4fv",
      uCameraMatrix: "uniformMatrix4fv",
      uPMatrix: "uniformMatrix4fv",
    });
    this.attachShader(vertexShader);
    this.attachShader(fragmentShader);
    this.activate();
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
