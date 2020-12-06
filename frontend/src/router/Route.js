class Route {
  path = null;

  pageLocation = null;

  tagName = null;

  constructor(path, pageLocation, tagName) {
    this.path = path;
    this.pageLocation = pageLocation;
    this.tagName = tagName;
  }

  loadPage = async () => {
    await import(this.pageLocation);

    const element = document.createElement(this.tagName);

    return element;
  };
}

export default Route;
