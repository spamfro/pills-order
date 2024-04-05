window.addEventListener('load', () => { window.app = new App() });

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
    this.router.match({ url: window.location.href, execute: true });
  }

  renderTake({ id, pid }) {
    this.ui.render({ 
      caption: `Prescription ${id} take product ${pid}`,
      message: 'TBD', 
      page: null
    });
  }

  async renderPrescription({ id }) {
    this.datasets = await this.fetchDatasets();

    const { prescriptions, inventory } = this.datasets; 

    const prescriptionPage = () => {
      const prescription = prescriptions.index.get(id);
      if (prescription) {
        return this.ui.prescriptionPage({ 
          prescription: new Prescription({ prescription, inventory: inventory.index })
        });
      }
    };

    this.ui.render({ 
      caption: `Prescription ${id}`,
      message: '', 
      page: prescriptionPage() ?? this.ui.notFoundPage()
    });
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
