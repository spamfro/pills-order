# Pills order

[Web components](./web-components.md)  

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

### Router
Unfortunately [Navigation web API](#navigation_web_api) is not widely supported yet.
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

## URLPattern web API (experimental)
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
### Events
```js
handlePopState = (...args) => { console.log('popstate', window.location.href, ...args) }
window.addEventListener('popstate', handlePopState)
removePopStateHandler = window.addEventListener.bind(window, 'popstate', handlePopState)

window.location.assign('#prescriptions/1/takes/1')
window.history.pushState({}, '', '#prescriptions/1/takes/2')  // NOTICE: won't trigger `popstate` event
window.history.back()
window.history.forward()
```


## <a name="navigation_web_api"></a>Navigation web API (experimental)
[MDN: Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API)  
[WICG: Navigation API](https://github.com/WICG/navigation-api)  
[Google: Modern client-side routing](https://developer.chrome.com/docs/web-platform/navigation-api/)  

[MDN: Navigation web API browser support](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API#browser_compatibility)  

```js
handleNavigate = (e) => {
  const currentUrl = window.location.href
  const destinationurl = e.destination.url
  e.intercept({
    async handler() {
      // render placeholder
      // const data = await fetch(...)
      // render data
    }
  })
}
navigation.addEventListener('navigate', handleNavigate)
removeNavigateHandler = navigation.removeEventListener.bind(navigation, 'navigate', handleNavigate)

window.location.assign('#prescriptions/1/takes/1')
window.history.pushState({}, '', '#prescriptions/1/takes/2')
window.history.back()
window.history.forward()
navigation.navigate('#prescriptions/1/takes/3')
```
