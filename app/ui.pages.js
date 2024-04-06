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

class TakePage extends HTMLElement {
  static registerCustomElement() {
    TakePage.template = document.querySelector('#page-take');
    window.customElements.define('x-page-take', TakePage);
  }
  constructor() {
    super();
    const fragment = document.importNode(TakePage.template.content, true);
    this.form = fragment.querySelector('form');
    this.attachShadow({ mode: 'open' }).appendChild(fragment);
  }
  render({ prescribedDoses, onSubmit } = {}) {
    if (prescribedDoses !== undefined) {
      this.form.prescribedDoses.value = parseInt(prescribedDoses.toString());
    }
    if (onSubmit !== undefined) {
      function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ prescribedDoses: parseInt(e.target.prescribedDoses.value) });
      }
      if (this.removeSubmitHandler) { this.removeSubmitHandler() }
      this.removeSubmitHandler = this.form.removeEventListener.bind(this.form, 'submit', handleSubmit);
      this.form.addEventListener('submit', handleSubmit);
    }
    return this;
  }
}

[NotFoundPage, PrescriptionPage, TakePage].forEach(x => x.registerCustomElement());
