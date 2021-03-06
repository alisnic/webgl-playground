import Transform from "./transform.js";

export default class Model {
  constructor(mesh, drawMode) {
    this.mesh = mesh;
    this.transform = new Transform();
    this.drawMode = drawMode;
    this.culling = false;
    this.blending = false;
  }

  setCulling(value) {
    this.culling = value;
    return this;
  }

  setTexture(glTexture) {
    this.texture = glTexture;
    return this;
  }

  setBlending(value) {
    this.blending = value;
    return this;
  }

  setScale(x, y, z) {
    this.transform.scale.set(x, y, z);
    return this;
  }

  setPosition(x, y, z) {
    this.transform.position.set(x, y, z);
    return this;
  }

  setRotation(x, y, z) {
    this.transform.rotation.set(x, y, z);
    return this;
  }

  addScale(x, y, z) {
    this.transform.scale.x += x;
    this.transform.scale.y += y;
    this.transform.scale.y += y;
    return this;
  }

  addPosition(x, y, z) {
    this.transform.position.x += x;
    this.transform.position.y += y;
    this.transform.position.z += z;
    return this;
  }

  addRotation(x, y, z) {
    this.transform.rotation.x += x;
    this.transform.rotation.y += y;
    this.transform.rotation.z += z;
    return this;
  }

  preRender() {
    this.transform.updateMatrix();
    return this;
  }
}
