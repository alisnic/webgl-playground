export default class Mover {
  constructor() {
    this.speed = 0.01;
    this.entities = [];
  }

  register(entity) {
    this.entities.push(entity);
    this.initialize(entity);
    return this;
  }

  initialize(entity) {
    entity.cdata.xdirection = 1;
    entity.cdata.ydirection = 1;
    entity.cdata.xspeed = this.speed;
    entity.cdata.yspeed = this.speed;
  }

  commit() {
    this.entities.forEach((entity) => {
      this.move(entity);
    });
  }

  move(entity) {
    if (entity.data.x > 0.9 || entity.data.x < -0.9) {
      entity.cdata.xdirection = -entity.cdata.xdirection;
    }

    if (entity.data.y > 0.9 || entity.data.y < -0.9) {
      entity.cdata.ydirection = -entity.cdata.ydirection;
    }

    entity.data.x = entity.data.x + entity.cdata.xdirection * entity.cdata.xspeed;
    entity.data.y = entity.data.y + entity.cdata.ydirection * entity.cdata.yspeed;
  }
}
