class Router extends EventTarget {
  constructor(patterns) {
    super();
    this.handleNavigated = (url) => {
      const pattern = patterns.find(pattern=> pattern.test(url));
      if (pattern) {
        this.dispatchEvent(new CustomEvent('router:navigated', { detail: pattern.exec(url) }));
      }
    };
    window.addEventListener('popstate', () => {
      this.handleNavigated(window.location.href);
    });
  }
  navigate(url) {
    window.history.pushState({}, '', url);
    this.handleNavigated(url);
  }
}
