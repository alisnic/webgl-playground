export default class Renderer {
  constructor(options) {
    this.options = options;
  }

  render(fn) {
    if (this.options.fps == 0) {
      return fn(1000);
    }

    var fpsInterval = 1000 / this.options.fps;
    var previousRenderAt = performance.now();
    var elapsed = 1000;

    var tickFn = () => {
      elapsed = performance.now() - previousRenderAt;

      if (elapsed > fpsInterval) {
        fn(elapsed);
        previousRenderAt = performance.now();
      }

      requestAnimationFrame(tickFn);
    };

    requestAnimationFrame(tickFn);
  }
}
