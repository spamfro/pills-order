# Pills order

[NDC: Web Components An Introduction to the Future](https://www.youtube.com/watch?v=xCeutzpRlzA)  
[MDN: Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)  
[MDN: template](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)  
[MDN: table](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement)  
[MDN: row](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableRowElement)  

### Setup services
```js
app.services = await new Services().init({ indexedDB: window.indexedDB })
```

### Load products
```js

values = await app.services.products.fetch()
app.datasets.products = new ProductsDataset({ values })
```

### Load inventory
```js
values = await app.services.inventory.fetch()
app.datasets.inventory = new InventoryDataset({ values })
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
