window.addEventListener('load', () => { window.app = new App() });

class App {
  constructor() {
    this.services = new Services();
    this.datasets = {};
    this.ui = {};
  }
}

//----------------------------------------------------------------------------------------
// NDC: https://www.youtube.com/watch?v=xCeutzpRlzA
// MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots
// MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template
// MDN: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement
// MDN: https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement

class OrderTable extends HTMLElement {
  static registerCustomElement() {
    [document.createElement('template')].forEach(row => {
      row.innerHTML = `
        <tr>
          <td></td>
          <td></td>
        </tr>
      `;
      OrderTable.row = row;
    });
    [document.createElement('template')].forEach(table => {
      table.innerHTML = `
        <style>
          .d-none {
            display: none;
          }
        </style>
        <table>
          <tbody></tbody>
        </tbale>
      `;
      OrderTable.table = table;
    });
    window.customElements.define('order-table', OrderTable);
  }
  constructor() {
    super();
    // const shadowRoot = this.attachShadow({ mode: 'open' });
    // this.el = shadowRoot.appendChild(OrderTable.table.content.cloneNode(true));
  }
  static get observedAttributes() {
    return ['label'];
  }
  attributeChanged

  render({ products }) {
    const header = ['DESCR', 'DPU'];
    if (products) {
      this.el.tBodies[0]?.remove();
      [document.createElement('tbody')].forEach(tbody => {
        products.rows.forEach(product => {
          const values = new Map([
            ['DESCR', product.description()],
            ['DPU', product.doses_per_unit()],
          ]);
          const row = OrderTable.row.content.cloneNode(true);
          Array.from(row.querySelectorAll('td')).forEach((td, col) => {
            td.textContent = values.get(header[col]);
          });
          tbody.appendChild(row);
        });
        this.el.appendChild(tbody);
      });
    }
    return this;
  }
}

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
      this.rows = rows;
    }
  }
}

class ProductRow extends Array {
  constructor({ id, description, doses_per_unit }) {
    super(id, description, doses_per_unit)
  }
  id() { return this[0] }
  description() { return this[1] }
  doses_per_unit() { return this[2] }
}

//----------------------------------------------------------------------------------------
class Services {
  constructor() {
    this.datasets = new Datasets();
  }
}

class Datasets {
  async fetchProducts() {
    return fetch('data/products.json')
      .then(response => {
        const { url, status, statusText } = response;
        if (!response.ok) { throw Error(`${url} ${status} (${statusText})`) }
        return response.json();
      });
  }
}
