class ButtonPrimary extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("button-primary");
    const shadowRoot = this.attachShadow({
      mode: "open",
    }).appendChild(template.content.cloneNode(true));
  }
}

customElements.define("button-primary", ButtonPrimary);
