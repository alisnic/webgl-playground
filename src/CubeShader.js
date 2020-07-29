import Shader from "../lib/Shader.js";
import Util from "../lib/Util.js";

export default class TextureShader extends Shader {
  static VERTEX_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : vert
		in vec4 a_position;	//Making it a vec4, the w component is used as color index from uColor
		in vec3 a_norm;
		in vec2 a_uv;

		uniform mat4 uPMatrix;
		uniform mat4 uMVMatrix;
		uniform mat4 uCameraMatrix;

		uniform vec3 uColor[6];
		uniform float uTime;

		out lowp vec4 color;
		out highp vec2 texCoord;  //Interpolate UV values to the fragment shader
		
		vec3 warp(vec3 p){
			//return p + 0.2 * abs(cos(uTime*0.002)) * a_norm;
			//return p + 0.5 * abs(cos(uTime*0.003 + p.y)) * a_norm;
			return p + 0.5 * abs(cos(uTime*0.003 + p.y*2.0 + p.x*2.0 + p.z)) * a_norm;
		}

		void main(void){
			texCoord = a_uv;
			color = vec4(uColor[ int(a_position.w) ],1.0);
			gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(warp(a_position.xyz), 1.0); 
		}`;

  static FRAGMENT_SRC = `#version 300 es
    #pragma vscode_glsllint_stage : frag
		precision mediump float;
		
		in vec4 color;
		in highp vec2 texCoord;		//What pixel to pull from the texture
		uniform sampler2D uMainTex;	//Holds the texture we loaded to the GPU
		
		out vec4 finalColor;
		void main(void){			//Confusing that UV's coords are S,T but in all honestly it works just like X,Y
			//finalColor = color;
			//finalColor = texture(uMainTex,texCoord);	//Just The Texture
			//finalColor = color * texture(uMainTex,texCoord); //Mixing Texture and Color together
			//finalColor = color * texture(uMainTex,texCoord) * 1.5f; //Making the colors brighter
			//finalColor = color + texture(uMainTex,texCoord); //Mixing the color and textures with addition,Dif effect
			finalColor = mix(color,texture(uMainTex,texCoord),0.8f); //Using mix func to fade between two pixel colors.
		}`;

  constructor(gl, projectionMatrix) {
    super(gl);

    this.uniforms({
      uMVMatrix: "uniformMatrix4fv",
      uCameraMatrix: "uniformMatrix4fv",
      uPMatrix: "uniformMatrix4fv",
      uMainTex: "uniform1i",
      uColor: "uniform3fv",
      uTime: "uniform1f",
    });

    this.activate();

    this.set(
      "uColor",
      new Float32Array(
        Util.rgbArray(
          "#FF0000",
          "00FF00",
          "0000FF",
          "909090",
          "C0C0C0",
          "404040"
        )
      )
    );
    this.setPerspective(projectionMatrix);
  }
}
