window.addEventListener('load', () => { window.app = new App() });

class App {
  constructor() {
    this.datasets = {};
    this.ui = {};
  }
  async init() {
    this.services = await new Services().init();
    return this;
  }
}
