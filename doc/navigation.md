# Navigation web API (experimental)

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
