class ProductsDataset {
  constructor({ values }) {
    const index = new Map(values[0].map((x, i) => [x, i]));
    const rows = [];
    const products = new Map();
    for (let i = 1; i < values.length; ++i) {
      try {
        const value = values[i];
        const id = parseInt(value[index.get('ID')]);
        const description = value[index.get('DESCR')];
        const doses_per_unit = parseInt(value[index.get('DPU')]);
        const isValidRow = id > 0 && description.length > 0 && doses_per_unit > 0;
        if (isValidRow) {
          const row = new ProductRow({ id, description, doses_per_unit });
          rows.push(row);
          products.set(id, row);
        }
      } catch {
        // noop
      }
    }
    this.rows = rows;
    this.products = products;
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

class PrescriptionsDataset {
  constructor({ values, products }) {
    const rows = [];
    const prescriptions = new Map();
    for (let i = 0; i < values.length; ++i) {
      try {
        const value = values[i];
        const id = parseInt(value.ID);
        const productId = parseInt(value.PID);
        const product = productId && products.get(productId);
        const prescribedDoses = parseInt(value.QTY);
        const isValidRow = id > 0 && !!product && prescribedDoses >= 0;
        if (isValidRow) { 
          const row = new PrescriptionRow({ id, product, prescribedDoses });
          rows.push(row);
          const items = prescriptions.get(id) ?? prescriptions.set(id, []).get(id);
          items.push(row);
        }
      } catch {
        // noop
      }
    }
    this.rows = rows;
    this.prescriptions = prescriptions;
  }
}

class PrescriptionRow extends Array {
  constructor({ id, product, prescribedDoses }) {
    super(id, product, prescribedDoses);
  }
  id() { return this[0] }
  product() { return this[1] }
  prescribedDoses() { return this[2] }
}
