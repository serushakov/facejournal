class Route {
  constructor(path, pageLocation) {
    this.path = path;
    this.pageLocation = pageLocation;
  }

  loadPage() {
    return loadPage(this.pageLocation);
  }
}

export default Route;
