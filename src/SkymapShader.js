import Shader from "../lib/Shader.js";

export default class SkymapShader extends Shader {
  static VERTEX_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : vert
		in vec4 a_position;	
		in vec2 a_uv;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;
	
		out highp vec3 texCoord;  //Interpolate UV values to the fragment shader
		
		void main(void){
			texCoord = a_position.xyz;
			gl_Position = uPMatrix * uCameraMatrix * vec4(a_position.xyz, 1.0); 
		}`;

  static FRAGMENT_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : frag
		precision mediump float;
		
		in highp vec3 texCoord;
		uniform samplerCube uDayTex;
		uniform samplerCube uNightTex;
		uniform float uTime;
		
		out vec4 finalColor;
		void main(void){
			// finalColor = mix(
      //  texture(uDayTex, texCoord), 
      //  texture(uNightTex, texCoord), 
      //  abs(sin(uTime * 0.0005)) 
      // );
      // );
      finalColor = texture(uDayTex, texCoord); 
		}`;

  constructor(gl, projectionMatrix) {
    super(gl);

    this.uniforms({
      uMVMatrix: "uniformMatrix4fv",
      uCameraMatrix: "uniformMatrix4fv",
      uPMatrix: "uniformMatrix4fv",
      uTime: "uniform1f",
      uDayTex: "uniform1i",
      uNightTex: "uniform1i",
    });

    this.activate();
    this.set("uPMatrix", false, projectionMatrix);
  }

  updateCamera(camera) {
    this.set("uCameraMatrix", false, camera.getStaticViewMatrix());
  }
}
