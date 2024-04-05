# Pills order

[Web components](./web-components.md)  
[URLPattern web API](./url-pattern.md)  
[Navigation web API](./navigation.md)  

### Setup services
```js
await app.services.init()
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

### Seed sample inventory
```js
values = [
  { PID: 3, QTY: 5 },
  { PID: 6, QTY: 15 },
].map(({ PID, QTY }) => [PID, QTY])  // TODO: ref schema
await app.services.inventory.put(values)
```

### Fetch datasets
```js
app.datasets = await app.fetchDatasets()
```

### Prescription UI
```js
page = document.importNode(document.querySelector('#page-prescription-layout').content, true)
prescription = app.datasets.prescriptions.index.get(1)
model = new Prescription({ prescription, inventory: app.datasets.inventory.index })
page.querySelector('x-prescription').render({ prescription: model })
app.ui.render({ page, caption: `Prescription ${prescription.id}`, message: '' })
```

### Take UI
```js
prescription = app.datasets.prescriptions.index.get(1)
page = document.importNode(document.querySelector('#page-take-layout').content, true)
page.querySelector('form') .addEventListener('submit', (e) => {
  e.preventDefault()
  console.log('take', { qty: parseInt(e.target.qty.value) })
})
app.ui.render({ page, caption: 'Take', message: '' })
```

### Router
Unfortunately [Navigation web API](./navigation.md) is not widely supported yet.
The next best thing is [History web API](https://developer.mozilla.org/en-US/docs/Web/API/History)  
```js
baseUrl = window.location.origin
app.router = new Router([
  { pattern: new URLPattern('#prescriptions/:id/takes/:pid', baseUrl),
    handler: ({ hash: { groups } }) => { console.log('takes', groups) }
  },
  { pattern: new URLPattern('#prescriptions/:id', baseUrl),
    handler: ({ hash: { groups } }) => { console.log('prescription', groups) }
  }
])

window.location.assign('#prescriptions/1/takes/1')
window.history.back()

app.router.navigate(new URL('#prescriptions/1/takes/3', baseUrl))
app.router.match({ url: window.location.href, execute: true })
```
