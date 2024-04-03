class Ui {
  constructor(el) {
    this.el = el;
    this.caption = { el: el.querySelector('.caption') };
    this.message = { el: el.querySelector('p.message') };
    this.page = { el: el.querySelector('main section.page') };
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
