window.addEventListener('load', () => { (window.app = new App()).init() });

class App {
  constructor() {
    this.services = new Services();

    this.ui = new Ui(document.body);

    const baseUrl = window.location.origin;
    this.router = new Router([
      { pattern: new URLPattern('#prescriptions/:id/takes/:pid', baseUrl),
        handler: ({ hash: { groups: { id, pid } } }) => { 
          this.renderTake({ id: parseInt(id), pid: parseInt(pid) });
        }
      },
      { pattern: new URLPattern('#prescriptions/:id', baseUrl),
        handler: ({ hash: { groups: { id } } }) => { 
          this.renderPrescription({ id: parseInt(id) });
        }
      }
    ]);
  }

  async init() {
    await this.services.init();
    this.datasets = await this.fetchDatasets();
    this.router.match({ url: window.location.href, execute: true });
  }

  renderTake({ id, pid }) {
    const { prescriptions } = this.datasets; 
    
    const prescription = prescriptions.index.get(id);
    const take = prescription && prescription.items.find(item => item.product().id() === pid);
    if (take) {
      const page = this.ui.takePage({ 
        prescribedDoses: take.prescribedDoses(), 
        onSubmit: console.log.bind(console, 'take')
      });
      this.ui.render({ page, caption: 'Take', message: take.product().description() });

    } else {
      const page = this.ui.notFoundPage();
      this.ui.render({ page, caption: 'Take', message: '' });
    }
  }

  renderPrescription({ id }) {
    const { prescriptions, inventory } = this.datasets; 

    const prescription = prescriptions.index.get(id);
    
    if (prescription) {
      const page = this.ui.prescriptionPage({
        prescription: new Prescription({ prescription, inventory: inventory.index })
      });
      app.ui.render({ page, caption: `Prescription ${id}`, message: '' });

    } else {
      const page = this.ui.notFoundPage();
      app.ui.render({ page, caption: 'Prescription', message: '' });
    }
  }

  async fetchDatasets() {
    const [productsValues, prescriptionsValues, inventoryValues] = [
      this.services.products.fetch(),
      this.services.prescriptions.fetch(),
      this.services.inventory.fetch()
    ];

    let products, prescriptions, inventory;
    const errors = [];
    try {
      products = new ProductsDataset({
        schema: Products.schema,
        values: await productsValues
      });
    } catch (error) {
      errors.push(error);
    }
    try {
      prescriptions = new PrescriptionsDataset({
        schema: Prescriptions.schema,
        values: await prescriptionsValues,
        indeces: { products: products.index }
      });
    } catch (error) {
      errors.push(error);
    }
    try {
      inventory = new InventoryDataset({
        schema: Inventory.schema,
        values: await inventoryValues,
        indeces: { products: products.index }
      });
    } catch (error) {
      errors.push(error);
    }

    if (errors.length > 0) {
      const [error] = errors;   // TODO: aggregate error
      return { error };
    }

    return { products, prescriptions, inventory };
  }
}
