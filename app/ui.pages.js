class NotFoundPage extends HTMLElement {
  static registerCustomElement() {
    NotFoundPage.template = document.querySelector('#page-not-found');
    window.customElements.define('x-page-not-found', NotFoundPage);
  }
  constructor() {
    super();
    const fragment = document.importNode(NotFoundPage.template.content, true);
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render() {
    return this;
  }
}

class PrescriptionPage extends HTMLElement {
  static registerCustomElement() {
    PrescriptionPage.template = document.querySelector('#page-prescription');
    window.customElements.define('x-page-prescription', PrescriptionPage);
  }
  constructor() {
    super();
    const fragment = document.importNode(PrescriptionPage.template.content, true);
    this.prescription = fragment.querySelector('x-prescription');
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render({ prescription } = {}) {
    this.prescription.render({ prescription });
    return this;
  }
}

class InventoryPage extends HTMLElement {
  static registerCustomElement() {
    InventoryPage.template = document.querySelector('#page-inventory');
    window.customElements.define('x-page-inventory', InventoryPage);
  }
  constructor() {
    super();
    const fragment = document.importNode(InventoryPage.template.content, true);
    this.form = fragment.querySelector('form');
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render({ doses, onSubmit } = {}) {
    if (doses !== undefined) {
      this.form.doses.value = parseInt(doses.toString());
    }
    if (onSubmit !== undefined) {
      function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ doses: parseInt(e.target.doses.value) });
      }
      if (this.removeSubmitHandler) { this.removeSubmitHandler() }
      this.removeSubmitHandler = this.form.removeEventListener.bind(this.form, 'submit', handleSubmit);
      this.form.addEventListener('submit', handleSubmit);
    }
    return this;
  }
}

[NotFoundPage, PrescriptionPage, InventoryPage].forEach(x => x.registerCustomElement());
