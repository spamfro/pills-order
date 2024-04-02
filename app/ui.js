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
