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
