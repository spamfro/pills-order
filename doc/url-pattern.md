# URLPattern web API (experimental)
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
