window.addEventListener('load', () => { window.app = new App() });

class App {
  constructor() {
    this.datasets = {};
    this.ui = new Ui(document.body);
  }
  async init() {
    this.services = await new Services().init();
    
    const baseUrl = window.location.origin;
    this.router = new Router([
      new URLPattern('#prescriptions/:id/takes/:pid', baseUrl),
      new URLPattern('#prescriptions/:id', baseUrl),
    ]);
    this.router.addEventListener('router:navigated', ({ detail }) => { this.handleRouterNavigated(detail) });

    return this;
  }
  handleRouterNavigated(match) {
    console.log('handleRouterNavigated', match);
  }
}
