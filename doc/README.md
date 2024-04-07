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

### Not Found UI
```js
app.ui.notFound ||= document.createElement('x-page-not-found')
page = app.ui.notFound.render()
app.ui.render({ page, caption: 'Page', message: '' })
```

### Prescription UI
```js
app.ui.prescription ||= document.createElement('x-page-prescription')
page = app.ui.prescription.render({
  prescription: new Prescription({
    prescription: app.datasets.prescriptions.index.get(1),
    inventory: app.datasets.inventory.index
  })
})
app.ui.render({ page, caption: 'Prescription', message: '' })
```

### Take UI
```js
app.ui.take ||= document.createElement('x-page-take')
page = app.ui.take.render({ onSubmit: console.log.bind(console, 'take') })
app.ui.render({ page, caption: 'Take', message: '' })
```

### Order UI
```js
app.ui.order ||= document.createElement('x-page-order')
page = app.ui.order.render({
  order: new Order({
    prescription: app.datasets.prescriptions.index.get(1),
    inventory: app.datasets.inventory.index
  })
})
app.ui.render({ page, caption: 'Order', message: '' })
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
