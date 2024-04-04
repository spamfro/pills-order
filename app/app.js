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
      { pattern: new URLPattern('#prescriptions/:id/takes/:pid', baseUrl),
        handler: ({ hash: { groups } }) => { this.renderTake(groups) }
      },
      { pattern: new URLPattern('#prescriptions/:id', baseUrl),
        handler: ({ hash: { groups } }) => { this.renderPrescription(groups) }
      }
    ]);

    this.router.match({ url: window.location.href, execute: true });

    return this;
  }
  renderTake({ id, pid }) {
    console.log('take', { id, pid });
  }
  renderPrescription({ id }) {
    console.log('prescription', { id });
  }
}
