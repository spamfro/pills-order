class ProductsDataset {
  constructor({ schema, values }) {
    schema = new Map(schema.map((col, idx) => [col, idx]));
    const rows = [];
    const index = new Map();
    for (let i = 0; i < values.length; ++i) {
      try {
        const value = values[i];
        const id = parseInt(value[schema.get('ID')]);
        const description = value[schema.get('DESCR')];
        const dosesPerUnit = parseInt(value[schema.get('DPU')]);
        const isValidRow = id > 0 && description.length > 0 && dosesPerUnit > 0;
        if (isValidRow) {
          const row = new ProductRow({ id, description, dosesPerUnit });
          rows.push(row);
          index.set(id, row);
        }
      } catch {
        // noop
      }
    }
    this.schema = schema;
    this.rows = rows;
    this.index = index;
  }
}

class ProductRow extends Array {
  constructor({ id, description, dosesPerUnit }) {
    super(id, description, dosesPerUnit);
  }
  id() { return this[0] }
  description() { return this[1] }
  dosesPerUnit() { return this[2] }
}

class InventoryDataset {
  constructor({ schema, values, indeces: { products } }) {
    schema = new Map(schema.map((col, idx) => [col, idx]));
    const rows = [];
    const index = new Map();
    for (let i = 0; i < values.length; ++i) {
      try {
        const value = values[i];
        const productId = parseInt(value[schema.get('PID')]);
        const product = productId && products.get(productId);
        const availableDoses = parseInt(value[schema.get('QTY')]);
        const isValidRow = !!product && availableDoses >= 0;
        if (isValidRow) { 
          const row = new InventoryRow({ product, availableDoses });
          rows.push(row);
          index.set(productId, row);
        }
      } catch {
        // noop
      }
    }
    this.schema = schema;
    this.rows = rows;
    this.index = index;
  }
}

class InventoryRow extends Array {
  constructor({ product, availableDoses }) {
    super(product, availableDoses);
  }
  product() { return this[0] }
  availableDoses() { return this[1] }
}

class PrescriptionsDataset {
  constructor({ schema, values, indeces: { products } }) {
    schema = new Map(schema.map((col, idx) => [col, idx]));
    const rows = [];
    const index = new Map();
    for (let i = 0; i < values.length; ++i) {
      try {
        const value = values[i];
        const id = parseInt(value[schema.get('ID')]);
        const productId = parseInt(value[schema.get('PID')]);
        const product = productId && products.get(productId);
        const prescribedDoses = parseInt(value[schema.get('QTY')]);
        const isValidRow = id > 0 && !!product && prescribedDoses >= 0;
        if (isValidRow) { 
          const row = new PrescriptionRow({ id, product, prescribedDoses });
          rows.push(row);
          const items = index.get(id) ?? index.set(id, []).get(id);
          items.push(row);
        }
      } catch {
        // noop
      }
    }
    this.schema = schema;
    this.rows = rows;
    this.index = index;
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
