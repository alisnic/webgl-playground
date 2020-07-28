import Shader from "../lib/Shader.js";
import ShaderLoader from "../lib/shader_loader.js";

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

    var loader = new ShaderLoader(gl);
    var vertexShader = loader.loadVertex(TextureShader.VERTEX_SRC);
    var fragmentShader = loader.loadFragment(TextureShader.FRAGMENT_SRC);

    this.uniforms({
      uMVMatrix: "uniformMatrix4fv",
      uCameraMatrix: "uniformMatrix4fv",
      uPMatrix: "uniformMatrix4fv",
      uMainTex: "uniform1i",
    });
    this.attachShader(vertexShader);
    this.attachShader(fragmentShader);
    this.activate();
    this.setPerspective(projectionMatrix);
  }

  useTexture(glTexture) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, glTexture);
    this.set("uMainTex", 0);
    return this;
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
