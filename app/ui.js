class Ui {
  constructor(el) {
    this.el = el;
    this.caption = { el: el.querySelector('.caption') };
    this.message = { el: el.querySelector('p.message') };
    this.page = { el: el.querySelector('main section.page') };
  }

  notFoundPage() {
    this.notFoundLayout ||= document.importNode(document.querySelector('#page-not-found-layout').content, true);
    return this.notFoundLayout;
  }

  prescriptionPage({ prescription }) {
    this.prescriptionLayout ||= document.importNode(document.querySelector('#page-prescription-layout').content, true);
    this.prescriptionLayout.querySelector('x-prescription')
      .render({ prescription });
    return this.prescriptionLayout;
  }

  takePage() {
    this.takeLayout ||= document.importNode(document.querySelector('#page-take-layout').content, true);
    return this.takeLayout;
  }

  render({ caption, message, page }) {
    if (caption !== undefined) {
      const text = caption.toString();
      this.caption.el.textContent = text;
      this.caption.el.classList.toggle('d-none', text === '');
    }
    if (message !== undefined) {
      const text = message.toString();
      this.message.el.textContent = text;
      this.message.el.classList.toggle('d-none', text === '');
    }
    if (page !== undefined) {
      const children = [page].filter(Boolean);
      this.page.el.replaceChildren(...children);
      this.page.el.classList.toggle('d-none', children.length === 0);
    }
  }
}
