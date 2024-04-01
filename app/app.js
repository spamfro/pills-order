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

//----------------------------------------------------------------------------------------
class OrderElement extends HTMLElement {
  static registerCustomElement() {
    OrderElement.table = document.createElement('template');
    OrderElement.table.innerHTML = `
      <style>
        .descr {
          text-align: left;
        }
        .dpu, .qty {
          min-width: 100px;
          text-align: right;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    OrderElement.row = document.createElement('template');
    OrderElement.row.innerHTML = `
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `;
    window.customElements.define('x-order', OrderElement);
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(OrderElement.table.content.cloneNode(true));
    this.table = shadowRoot.querySelector('table');
  }

  render({ order }) {
    const header = ['DESCR', 'DPU', 'QTY'];
    if (order) {
        const rows = order.items.map(item => {
          const values = new Map([
            ['DESCR', item.description()],
            ['DPU', item.doses_per_unit()],
            ['QTY', item.available_doses()],
          ]);
          const colClassNames = new Map([
            ['DPU', ['dpu']],
            ['QTY', ['qty']],
          ]);
          const row = OrderElement.row.content.cloneNode(true);
          Array.from(row.querySelectorAll('td'))
            .map((td, colIndex) => [td, values.get(header[colIndex]), colClassNames.get(header[colIndex])])
            .forEach(([td, text, classNames]) => {
              if (classNames) { td.classList.add(...classNames) }
              td.textContent = text;
            });
          return row;
        });
        this.table.tBodies[0].replaceChildren(...rows);

        const colClassNames = new Map([
          ['DESCR', ['descr']],
          ['DPU', ['dpu']],
          ['QTY', ['qty']],
        ]);
        Array.from(this.table.tHead.rows[0].cells)
          .map((th, colIndex) => [th, header[colIndex], colClassNames.get(header[colIndex])])
          .forEach(([th, text, classNames]) => {
            if (classNames) { th.classList.add(...classNames) }
            th.textContent = text;
          });
    }
    return this;
  }
}

[OrderElement].forEach(x => x.registerCustomElement());

//----------------------------------------------------------------------------------------
class ProductsDataset {
  constructor({ values }) {
    const index = new Map(values[0].map((x, i) => [x, i]));
    const rows = [];
    for (let i = 1; i < values.length; ++i) {
      try {
        const value = values[i];
        const id = parseInt(value[index.get('ID')]);
        const description = value[index.get('DESCR')];
        const doses_per_unit = parseInt(value[index.get('DPU')]);
        const isValidRow = id > 0 && description.length > 0 && doses_per_unit > 0;
        if (isValidRow) { rows.push(new ProductRow({ id, description, doses_per_unit })) }
      } catch {
        // noop
      }
    }
    this.rows = rows;
  }
}

class ProductRow extends Array {
  constructor({ id, description, doses_per_unit }) {
    super(id, description, doses_per_unit);
  }
  id() { return this[0] }
  description() { return this[1] }
  doses_per_unit() { return this[2] }
}

class InventoryDataset {
  constructor({ values }) {
    const rows = [];
    for (let i = 0; i < values.length; ++i) {
      try {
        const value = values[i];
        const id = parseInt(value.ID);
        const available_doses = parseInt(value.QTY);
        const isValidRow = id > 0 && available_doses >= 0;
        if (isValidRow) { rows.push(new InventoryRow({ id, available_doses })) }
      } catch {
        // noop
      }
    }
    this.rows = rows;
  }
}

class InventoryRow extends Array {
  constructor({ id, available_doses }) {
    super(id, available_doses);
  }
  id() { return this[0] }
  available_doses() { return this[1] }
}

//----------------------------------------------------------------------------------------
class Order {
  constructor({ products, inventory }) {
    const productQty = new Map(
      inventory.rows.map(row => [row.id(), row.available_doses()])
    );
    this.items = products.rows.map(row => new OrderItem({ 
      id: row.id(), 
      description: row.description(), 
      doses_per_unit: row.doses_per_unit(), 
      available_doses: productQty.get(row.id()) ?? 0,
    }));
  }
}

class OrderItem extends Array {
  constructor({ id, description, doses_per_unit, available_doses }) {
    super(id, description, doses_per_unit, available_doses);
  }
  id() { return this[0] }
  description() { return this[1] }
  doses_per_unit() { return this[2] }
  available_doses() { return this[3] }
}

//----------------------------------------------------------------------------------------
class Services {
  constructor() {
    this.products = new Products();
  }
  async init() {
    const [localDb] = [new LocalDb({ indexedDB: window.indexedDB }).open()];  // start all
    this.localDb = await localDb;
    return this;
  }
}

class Products {
  async fetch() {
    return fetch('data/products.json')
      .then(response => {
        const { url, status, statusText } = response;
        if (!response.ok) { throw Error(`${url} ${status} (${statusText})`) }
        return response.json();
      });
  }
}

class LocalDb {
  constructor({ indexedDB }) {
    this.indexedDB = indexedDB;
  }
  async open() {
    const upgrade = (db, { oldVersion, newVersion }) => {
      db.createObjectStore('Inventory', { keyPath: 'ID' });
    };
    this.db = await new Promise((resolve, reject) => {
      const req = this.indexedDB.open('LocalDb', 1);
      req.onerror = () => { reject(req.error) };
      req.onsuccess = () => { resolve(req.result) };
      req.onupgradeneeded = (event) => { upgrade(req.result, event) };
    });
    return this;
  }
  async fetchInventory() {
    return new Promise((resolve, reject) => {
      const tr = this.db.transaction(['Inventory'], 'readonly');
      tr.onerror = () => { reject(tr.error) };
      const store = tr.objectStore('Inventory');
      const req = store.getAll();
      req.onsuccess = () => { resolve(req.result) };
    });
  }
  async putInventory(values) {
    return new Promise((resolve, reject) => {
      const tr = this.db.transaction(['Inventory'], 'readwrite');
      tr.onerror = () => { reject(tr.error) };
      tr.oncomplete = () => { resolve() };
      const store = tr.objectStore('Inventory');
      values.forEach(({ ID, QTY }) => { store.put({ ID, QTY }) });
    });
  }
  async deleteInventory(ids) {
    return new Promise((resolve, reject) => {
      const tr = this.db.transaction(['Inventory'], 'readwrite');
      tr.onerror = () => { reject(tr.error) };
      tr.oncomplete = () => { resolve() };
      const store = tr.objectStore('Inventory');
      ids.forEach(id => { store.delete(id) });
    });
  }
}