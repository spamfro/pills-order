class PrescriptionElement extends HTMLElement {
  static registerCustomElement() {
    PrescriptionElement.table = document.createElement('template');
    PrescriptionElement.table.innerHTML = `
      <style>
        table {
          border-spacing: 0px;
        }
        thead th {
          border-bottom: solid;
        }
        .descr {
          text-align: left;
        }
        .dpu, .qty {
          text-align: right;
          padding-left: 1em;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;
    PrescriptionElement.row = document.createElement('template');
    PrescriptionElement.row.innerHTML = `
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    `;
    window.customElements.define('x-prescription', PrescriptionElement);
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(PrescriptionElement.table.content.cloneNode(true));
    this.table = shadowRoot.querySelector('table');
  }

  render({ prescription }) {
    const header = ['DESCR', 'DPU', 'PQTY', 'AQTY'];
    if (prescription) {
      const rows = prescription.items.map(item => {
        const values = new Map([
          ['DESCR', item.product().description()],
          ['DPU', item.product().dosesPerUnit()],
          ['PQTY', item.prescribedDoses()],
          ['AQTY', item.availableDoses()],
        ]);
        const colClassNames = new Map([
          ['DPU', ['dpu']],
          ['PQTY', ['qty']],
          ['AQTY', ['qty']],
        ]);
        const row = PrescriptionElement.row.content.cloneNode(true);
        Array.from(row.querySelectorAll('td'))
          .map((td, colIndex) => [td, values.get(header[colIndex]), colClassNames.get(header[colIndex])])
          .forEach(([td, text, classNames]) => {
            if (classNames) { td.classList.add(...classNames) }
            td.textContent = text;
          });
        return row;
      });
      this.table.tBodies[0].replaceChildren(...rows);

      const values = new Map([
        ['DESCR', 'Description'],
        ['DPU', 'Unit'],
        ['PQTY', 'Prescr.'],
        ['AQTY', 'Avail.'],
      ]);
      const colClassNames = new Map([
        ['DESCR', ['descr']],
        ['DPU', ['dpu']],
        ['PQTY', ['qty']],
        ['AQTY', ['qty']],
      ]);
      Array.from(this.table.tHead.rows[0].cells)
        .map((th, colIndex) => [th, values.get(header[colIndex]), colClassNames.get(header[colIndex])])
        .forEach(([th, text, classNames]) => {
          if (classNames) { th.classList.add(...classNames) }
          th.textContent = text;
        });
    }
    return this;
  }
}

[PrescriptionElement].forEach(x => x.registerCustomElement());
