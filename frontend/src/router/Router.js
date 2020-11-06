class Router {
  routes = [];
  rootElement = null;

  prevLocation = null;

  registeredElements = new Set();

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

    const elements = route
      ? await route.loadPage()
      : await this.routes.find((item) => item.path === null)?.loadPage();

    if (elements) {
      this.mountRoute(elements);
    } else {
      throw Error("No route to render");
    }

    this.prevLocation = currentLocation;
  };

  mountRoute({ head, body }) {
    this.clearCurrentRouteContent();

    this.registerElements([...head, ...body]);

    if (head) {
      document.head.append(...head);
    }

    this.rootElement.append(...body);
  }

  registerElements(elements) {
    elements.forEach((item) => this.registeredElements.add(item));
  }

  clearCurrentRouteContent = () => {
    this.registeredElements.forEach((item) => item.remove());
    this.registeredElements.clear();
  };
}

export default Router;
