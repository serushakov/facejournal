class Router {
  routes = [];
  rootElement = null;

  prevLocation = null;

  constructor(rootElement, routes) {
    this.routes = routes;
    this.rootElement = rootElement;

    this.listenToRouteChanges();
    this.handleLocationChange();
  }

  listenToRouteChanges() {
    window.addEventListener("popstate", this.handleLocationChange);
  }

  handleLocationChange = async () => {
    const currentLocation = location.pathname;

    const route = this.routes.find((item) => item.path === currentLocation);
    console.log(route, this.routes, currentLocation);

    if (route) {
      const elements = await route.loadPage();

      console.log(elements);

      // clearing content
      while (this.rootElement.lastElementChild) {
        this.rootElement.removeChild(this.rootElement.lastElementChild);
      }

      this.rootElement.append(...elements);
    } else {
      this.routes.find((item) => item.path === null)?.loadPage();
    }

    this.prevLocation = currentLocation;
  };
}

export default Router;
