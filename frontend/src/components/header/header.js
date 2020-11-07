class Header extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("header");
    const shadowRoot = this.attachShadow({
      mode: "open",
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
  }

  loadStyle = async () => {
    this.shadowRoot.append(
      await loadStyles("/components/header/header.css"),
      await loadStyles("/reset.css")
    );
  };
}

customElements.define("i-header", Header);
