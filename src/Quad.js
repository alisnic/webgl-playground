import Mesh from "../lib/Mesh.js";
import Model from "../lib/Model.js";

export default class Quad {
  static buildModel(program) {
    var meshData = this.getData();

    var mesh = new Mesh(program)
      .addVerts(meshData.verts)
      .addIndices(meshData.indices)
      .addUVs(meshData.uvs);

    return new Model(mesh, program.gl.TRIANGLES)
      .setCulling(false)
      .setBlending(true);
  }

  static getData() {
    var aIndex = [], //0,1,2, 2,3,0
      aUV = [], //0,0, 0,1, 1,1, 1,0
      aVert = [];

    for (var i = 0; i < 10; i++) {
      //Calculate a random size, y rotation and position for the quad
      var size = 0.2 + 0.8 * Math.random(), //Random Quad Size in the range of 0.2 - 1.0
        half = size * 0.5, //Half of size, this is the radius for rotation
        angle = Math.PI * 2 * Math.random(), //Random angle between 0 - 360 degrees in radians
        dx = half * Math.cos(angle), //Calc the x distance, used as an offset for the random position
        dy = half * Math.sin(angle), //Calc the y distance, for same offset but used in z
        x = -2.5 + Math.random() * 5, //Random position between -2.5 - 2.5
        y = -2.5 + Math.random() * 5,
        z = 2.5 - Math.random() * 5,
        p = i * 4; //Index of the first vertex of a quad

      //Build the 4 points of the quad
      aVert.push(x - dx, y + half, z - dy); //TOP LEFT
      aVert.push(x - dx, y - half, z - dy); //BOTTOM LEFT
      aVert.push(x + dx, y - half, z + dy); //BOTTOM RIGHT
      aVert.push(x + dx, y + half, z + dy); //TOP RIGHT

      aUV.push(0, 0, 0, 1, 1, 1, 1, 0); //Quad's UV
      aIndex.push(p, p + 1, p + 2, p + 2, p + 3, p); //Quad's Index
    }

    return { uvs: aUV, indices: aIndex, verts: aVert };
  }
}
