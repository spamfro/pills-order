# Pills order

[NDC: Web Components An Introduction to the Future](https://www.youtube.com/watch?v=xCeutzpRlzA)  
[MDN: Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)  
[MDN: template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)  
[MDN: table](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement)  
[MDN: row](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement)  

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

### Load inventory
```js
app.datasets.inventory = new InventoryDataset({
  values: await app.services.localDb.fetchInventory()
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
app.services.localDb.putInventory([
  { ID: 3, QTY: 5 },
  { ID: 6, QTY: 15 },
])
app.datasets.inventory = new InventoryDataset({
  values: await app.services.localDb.fetchInventory()
})
app.ui.order.render({ 
  order: new Order({
    products: app.datasets.products,
    inventory: app.datasets.inventory,
  })
})
```
