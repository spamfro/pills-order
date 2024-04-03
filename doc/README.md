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
  schema: Products.schema,
  values: await app.services.products.fetch()
})
```

### Seed sample prescriptions
```js
values = [
  { ID: 1, PID: 1, QTY: 30 },
  { ID: 1, PID: 2, QTY: 15 },
  { ID: 1, PID: 3, QTY: 60 },
  { ID: 1, PID: 4, QTY: 60 },
  { ID: 1, PID: 5, QTY: 30 },
  { ID: 1, PID: 6, QTY: 9 },
  { ID: 1, PID: 6, QTY: 2 },
].map(({ ID, PID, QTY }) => [ID, PID, QTY])  // TODO: ref schema
await app.services.prescriptions.put(values)
```

### Load prescriptions
```js
app.datasets.prescriptions = new PrescriptionsDataset({
  schema: Prescriptions.schema,
  values: await app.services.prescriptions.fetch(),
  indeces: { products: app.datasets.products.index }
})
```

### Seed sample inventory
```js
values = [
  { PID: 3, QTY: 5 },
  { PID: 6, QTY: 15 },
].map(({ PID, QTY }) => [PID, QTY])  // TODO: ref schema
await app.services.inventory.put(values)
```

### Load inventory
```js
app.datasets.inventory = new InventoryDataset({
  schema: Inventory.schema,
  values: await app.services.inventory.fetch(),
  indeces: { products: app.datasets.products.index }
})
```

### Prescription model
```js
prescription = new Prescription({
  prescription: app.datasets.prescriptions.index.get(1),
  inventory: app.datasets.inventory.index,
})
```

### Prescription UI
```js
app.ui.prescription = document.createElement('x-prescription').render({ prescription })
app.ui.render({ 
  caption: `Prescription ${prescription.id}`,
  message: '', 
  page: app.ui.prescription
})
```

## URLPattern web API
[MDN: URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)  
[URLPattern polyfill](https://www.npmjs.com/package/urlpattern-polyfill)  

### Install polyfill
```bash
docker container exec -it --detach-keys 'ctrl-x' -u node node-app bash
npm install urlpattern-polyfill
tar -czC node_modules urlpattern-polyfill/index.js urlpattern-polyfill/dist/urlpattern.js | tar -xzvC app
```
### Test
```js
pattern = new URLPattern({ hash: 'prescriptions/:id/takes/:pid' })
url = 'https://local.spamfro.site:3443#prescriptions/1/takes/2'   // window.location.href
console.log(pattern.test(url))
console.log(pattern.exec(url)?.hash.groups)
```
