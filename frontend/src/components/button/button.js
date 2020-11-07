class Button extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("button");
    const shadowRoot = this.attachShadow({
      mode: "open",
    }).appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    if (!this.attributes.variant) {
      throw Error("Button should have a variant attribute");
    }

    const buttonElement = this.shadowRoot.getElementById("button");

    buttonElement.classList.add(this.attributes.variant?.value);
  }
}

customElements.define("i-button", Button);
