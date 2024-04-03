window.addEventListener('load', () => { window.app = new App() });

class App {
  constructor() {
    this.datasets = {};
    this.ui = new Ui(document.body);
  }
  async init() {
    this.services = await new Services().init();
    return this;
  }
}
