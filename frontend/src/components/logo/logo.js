console.log("kek");
class Logo extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("logo");

    const shadowRoot = this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }
}

customElements.define("brand-logo", Logo);
