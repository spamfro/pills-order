# Pills order

[NDC: Web Components An Introduction to the Future](https://www.youtube.com/watch?v=xCeutzpRlzA)  
[MDN: Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)  
[MDN: template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)  
[MDN: table](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement)  
[MDN: row](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement)  


### Demo
```js
app.services = await new Services().init()
app.datasets.products = new ProductsDataset({
  values: await app.services.products.fetch()
})
app.datasets.prescriptions = new PrescriptionsDataset({
  values: await app.services.prescriptions.fetch(),
  products: app.datasets.products.products,
})
app.datasets.inventory = new InventoryDataset({
  values: await app.services.inventory.fetch()
})
order = new Order({
  products: app.datasets.products,
  inventory: app.datasets.inventory,
})
app.ui.order = document.createElement('x-order').render({ order })
document.body.appendChild(app.ui.order)
```



### Setup services
```js
app.services = await new Services().init()
```

### Load products
```js
app.datasets.products = new ProductsDataset({
  values: await app.services.products.fetch()
})
```

### Load prescriptions
```js
await app.services.prescriptions.put([
  { ID: 1, PID: 1, QTY: 30 },
  { ID: 1, PID: 2, QTY: 15 },
  { ID: 1, PID: 3, QTY: 60 },
  { ID: 1, PID: 4, QTY: 60 },
  { ID: 1, PID: 5, QTY: 30 },
  { ID: 1, PID: 6, QTY: 9 },
  { ID: 1, PID: 6, QTY: 2 },
])

app.datasets.prescriptions = new PrescriptionsDataset({
  values: await app.services.prescriptions.fetch(),
  products: app.datasets.products.products,
})
```

### Load inventory
```js
await app.services.inventory.put([
  { ID: 3, QTY: 5 },
  { ID: 6, QTY: 15 },
])
app.datasets.inventory = new InventoryDataset({
  values: await app.services.inventory.fetch()
})
```

### Build order
```js
order = new Order({
  products: app.datasets.products,
  inventory: app.datasets.inventory,
})
```

### Orders ui
```js
app.ui.order = document.createElement('x-order').render({ order })
document.body.appendChild(app.ui.order)
```

### Update order
```js

app.ui.order.render({ 
  order: new Order({
    products: app.datasets.products,
    inventory: app.datasets.inventory,
  })
})
```
### Prescriptions
```js

```
