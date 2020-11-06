class Route {
  path = null;
  pageLocation = null;
  pageContent = null;

  constructor(path, pageLocation) {
    this.path = path;
    this.pageLocation = pageLocation;
  }

  loadPage = async () => {
    this.pageContent =
      this.pageContent ?? (await getPageContent(this.pageLocation));

    return this.pageContent;
  };
}

export default Route;
