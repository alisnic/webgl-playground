import Shader from "../lib/Shader.js";

export default class TextureShader extends Shader {
  static VERTEX_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : vert
		in vec3 a_position;	//Standard position data.
		in vec2 a_uv;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;

		out highp vec2 texCoord;  //Interpolate UV values to the fragment shader

		void main(void){
			texCoord = a_uv;
			gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0); 
		}`;

  static FRAGMENT_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : frag
    precision mediump float;
		
		in highp vec2 texCoord;
		uniform sampler2D uMainTex;
		
		out vec4 finalColor;
		void main(void){
			finalColor = texture(uMainTex, vec2(texCoord.s, texCoord.t));
		}`;

  constructor(gl, projectionMatrix) {
    super(gl);

    this.uniforms({
      uMVMatrix: "uniformMatrix4fv",
      uCameraMatrix: "uniformMatrix4fv",
      uPMatrix: "uniformMatrix4fv",
      uMainTex: "uniform1i",
    });

    this.activate();
    this.setPerspective(projectionMatrix);
  }
}
