class Prescription {
  constructor({ prescription, inventory }) {
    this.items = prescription.map(take => new PrescriptionItem({ 
      product: take.product(),
      prescribedDoses: take.prescribedDoses(),
      availableDoses: inventory.get(take.product().id())?.availableDoses() ?? 0,
    }));
  }
}

class PrescriptionItem extends Array {
  constructor({ product, prescribedDoses, availableDoses }) {
    super(product, prescribedDoses, availableDoses);
  }
  product() { return this[0] }
  prescribedDoses() { return this[1] }
  availableDoses() { return this[2] }
}
