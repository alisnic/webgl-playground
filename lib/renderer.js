export default class Renderer {
  constructor(options) {
    this.options = options;
  }

  render(fn) {
    if (this.options.once) {
      return fn();
    }

    var fpsInterval = 1000 / this.options.fps;
    var previousRenderAt = Date.now();
    var elapsed = 1000;

    var tickFn = () => {
      elapsed = Date.now() - previousRenderAt;

      if (elapsed > fpsInterval) {
        fn();
        previousRenderAt = Date.now();
      }

      requestAnimationFrame(tickFn);
    };

    requestAnimationFrame(tickFn);
  }
}
