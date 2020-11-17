class PageNotFound extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml("/views/404/404.html").then(this.setContent);
  }

  setContent = (document) => {
    const template = document.querySelector("template");

    this.appendChild(template.content.cloneNode(true));
  };
}

customElements.define("page-not-found", PageNotFound);
