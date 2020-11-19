class Router {
  routes = [];
  rootElement = null;

  prevLocation = null;

  registeredElements = new Set();

  static navigate(path, options) {
    if (location.pathname !== path) {
      if (options?.replace) {
        history.replaceState(null, null, path);
      } else {
        history.pushState(null, null, path);
      }
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }

  constructor(rootElement, routes) {
    this.routes = routes;
    this.rootElement = rootElement;

    this.listenToRouteChanges();
    this.handleLocationChange();
  }

  listenToRouteChanges() {
    window.addEventListener("popstate", this.handleLocationChange);
  }

  getRoute(currentLocation) {
    const route = this.routes.find((item) => item.path === currentLocation);

    if (route) {
      return route;
    }
    return this.routes.find((item) => item.path === null);
  }

  handleLocationChange = async () => {
    const currentLocation = location.pathname;

    const element = await this.getRoute(currentLocation).loadPage();

    if (element) {
      this.mountRoute(element);
    } else {
      throw Error("No route to render");
    }

    this.prevLocation = currentLocation;
  };

  mountRoute(element) {
    this.clearCurrentRouteContent();

    this.registeredElements.add(element);
    this.rootElement.append(element);
  }

  clearCurrentRouteContent = () => {
    this.registeredElements.forEach((element) => element.remove());
    this.registeredElements.clear();
  };
}

export default Router;
