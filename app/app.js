window.addEventListener('load', () => { (window.app = new App()).init() });

class App {
  constructor() {
    this.services = new Services();

    this.ui = new Ui(document.body);

    const baseUrl = window.location.origin;
    this.router = new Router([
      { pattern: new URLPattern('#prescriptions/:id/inventory/:pid', baseUrl),
        handler: ({ hash: { groups: { id, pid } } }) => { 
          this.renderInventory({ prescriptionId: parseInt(id), productId: parseInt(pid) });
        }
      },
      { pattern: new URLPattern('#prescriptions/:id', baseUrl),
        handler: ({ hash: { groups: { id } } }) => { 
          this.renderPrescription({ prescriptionId: parseInt(id) });
        }
      },
      { pattern: new URLPattern('#*', baseUrl),
        handler: () => { this.renderNotFound() }
      }
    ]);
  }

  async init() {
    await this.services.init();
    this.datasets = await this.fetchDatasets();
    this.router.match({ url: window.location.href, execute: true });
  }

  renderNotFound() {
    const page = this.ui.notFoundPage();
    this.ui.render({ page, caption: '', message: '' });
  }

  renderInventory({ prescriptionId, productId }) {
    const { products, inventory } = this.datasets; 
    
    const product = products.index.get(productId);
    if (product) {
      const row = inventory.rows.find(row => row.product().id() === product.id());
      const availableDoses = row?.availableDoses() ?? 0;
      const handleSubmit = ({ doses }) => {
        inventory.put({ product, availableDoses: doses });
        this.router.navigate(new URL(`#prescriptions/${prescriptionId}`, window.location.origin));
      };
      const page = this.ui.inventoryPage({ doses: availableDoses, onSubmit: handleSubmit });
      this.ui.render({ page, caption: 'Inventory', message: product.description() });

    } else {
      this.renderNotFound();
    }
  }

  renderPrescription({ prescriptionId }) {
    const { prescriptions, inventory } = this.datasets; 

    const prescription = prescriptions.index.get(prescriptionId);
    
    if (prescription) {
      const page = this.ui.prescriptionPage({
        prescription: new Prescription({ prescription, inventory: inventory.index })
      });
      app.ui.render({ page, caption: `Prescription ${prescriptionId}`, message: '' });

    } else {
      this.renderNotFound();
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
