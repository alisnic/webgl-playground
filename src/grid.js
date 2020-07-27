import Mesh from "../lib/Mesh.js";
import Model from "../lib/Model.js";

export default class Grid {
  static buildModel(program, incAxis) {
    var grid = new Mesh(program, program.gl.LINES)
      .setData(Grid.build(incAxis))
      .setComponentSize(4)
      .enableAttributes({
        a_position: {
          size: 3,
          type: "FLOAT",
          stride: Float32Array.BYTES_PER_ELEMENT * 4,
        },
        a_color: {
          size: 1,
          type: "FLOAT",
          stride: Float32Array.BYTES_PER_ELEMENT * 4,
          offset: Float32Array.BYTES_PER_ELEMENT * 3,
        },
      });

    return new Model(grid);
  }

  static build(incAxis) {
    var verts = [],
      size = 1.8, // W/H of the outer box of the grid, from origin we can only go 1 unit in each direction, so from left to right is 2 units max
      div = 10.0, // How to divide up the grid
      step = size / div, // Steps between each line, just a number we increment by for each line in the grid.
      half = size / 2; // From origin the starting position is half the size.

    var p; //Temp variable for position value.
    for (var i = 0; i <= div; i++) {
      //Vertical line
      p = -half + i * step;
      verts.push(p); //x1
      verts.push(half); //y1
      verts.push(0); //z1
      verts.push(0); //c2

      verts.push(p); //x2
      verts.push(-half); //y2
      verts.push(0); //z2
      verts.push(1); //c2

      //Horizontal line
      p = half - i * step;
      verts.push(-half); //x1
      verts.push(p); //y1
      verts.push(0); //z1
      verts.push(0); //c1

      verts.push(half); //x2
      verts.push(p); //y2
      verts.push(0); //z2
      verts.push(1); //c2
    }

    if (incAxis) {
      //x axis
      verts.push(-1.1); //x1
      verts.push(0); //y1
      verts.push(0); //z1
      verts.push(1); //c2

      verts.push(1.1); //x2
      verts.push(0); //y2
      verts.push(0); //z2
      verts.push(1); //c2

      //y axis
      verts.push(0); //x1
      verts.push(-1.1); //y1
      verts.push(0); //z1
      verts.push(2); //c2

      verts.push(0); //x2
      verts.push(1.1); //y2
      verts.push(0); //z2
      verts.push(2); //c2

      //z axis
      verts.push(0); //x1
      verts.push(0); //y1
      verts.push(-1.1); //z1
      verts.push(3); //c2

      verts.push(0); //x2
      verts.push(0); //y2
      verts.push(1.1); //z2
      verts.push(3); //c2
    }

    return verts;
  }
}
