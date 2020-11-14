class Logo extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml("/components/logo/logo.html").then(this.createShadowRoot);
  }

  createShadowRoot = (document) => {
    const template = document.getElementById("logo");

    this.attachShadow({
      mode: "open",
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
  };

  loadStyle = async () => {
    this.shadowRoot.append(
      await loadStyles("/components/logo/logo.css"),
      await loadStyles("/reset.css")
    );
  };
}

customElements.define("brand-logo", Logo);
