class Router {
  routes = [];

  rootElement = null;

  prevLocation = null;

  registeredElements = new Set();

  static navigate(path, options) {
    if (window.location.pathname !== path) {
      if (options?.replace) {
        window.history.replaceState(null, null, path);
      } else {
        window.history.pushState(null, null, path);
      }
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  constructor(rootElement, routes) {
    this.routes = routes;
    this.rootElement = rootElement;

    this.listenToRouteChanges();
    this.handleLocationChange();
  }

  listenToRouteChanges() {
    window.addEventListener('popstate', this.handleLocationChange);
  }

  getRoute(currentLocation) {
    const route = this.routes.find((item) =>
      this.compareRoutes(item.path, currentLocation)
    );

    if (route) {
      return route;
    }
    return this.routes.find((item) => item.path === null);
  }

  cleanupRoute = (pathname) => {
    if (!pathname.endsWith('/')) return pathname;

    const result = pathname.substring(0, pathname.lastIndexOf('/'));

    window.history.replaceState(null, null, result);

    return result;
  };

  compareRoutes = (route, dirtyPathname) => {
    if (route === null) return;
    const pathname = this.cleanupRoute(dirtyPathname);

    const routeParts = route.split('/');
    const pathnameParts = pathname.split('/');

    if (routeParts.length !== pathnameParts.length) return false;

    return routeParts.reduce((result, current, index) => {
      // skip param
      if (current.startsWith(':')) return result;

      return result && current === pathnameParts[index];
    }, true);
  };

  handleLocationChange = async () => {
    const currentLocation = window.location.pathname;

    const route = this.getRoute(currentLocation);

    if (route) {
      this.mountRoute(route);
    } else {
      throw Error('No route to render');
    }

    this.prevLocation = currentLocation;
  };

  parseParams = (route, pathname) => {
    const routeParts = route.split('/');
    const pathnameParts = pathname.split('/');

    return Object.fromEntries(
      routeParts
        .map((item, index) => {
          if (!item.startsWith(':')) return undefined;

          return [item.substring(1), pathnameParts[index]];
        })
        .filter(Boolean)
    );
  };

  async mountRoute(route) {
    const element = await route.loadPage();
    const params =
      route.path && this.parseParams(route.path, window.location.pathname);

    element.params = params;

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
