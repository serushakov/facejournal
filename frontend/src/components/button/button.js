class Button extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("button");
    const shadowRoot = this.attachShadow({
      mode: "open",
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
  }

  connectedCallback() {
    if (!this.attributes.variant) {
      throw Error("Button should have a variant attribute");
    }

    this.buttonElement = this.shadowRoot.getElementById("button");

    for (let attribute of Array.from(this.attributes)) {
      this.setButtonAttribute(attribute.name, attribute.value);
    }

    this.addEventListener("click", this.handleClick);
  }

  handleClick = () => {
    if (this.submitButton) {
      this.submitButton.click();
    }
  };

  async loadStyle() {
    this.shadowRoot.append(
      await loadStyles("/components/button/button.css"),
      await loadStyles("/reset.css")
    );
  }

  setButtonAttribute(name, value, oldValue) {
    switch (name) {
      case "form-selector":
        if (oldValue && this.submitButton) {
          this.submitButton.remove();
        }
        if (value) {
          const form = document.querySelector(value);
          if (!form) throw Error("No form found with selector " + value);

          // Creating a hidden submit button to submit the form
          const button = document.createElement("button");
          button.type = "submit";
          button.hidden = true;

          form.appendChild(button);

          this.submitButton = button;
        }
        break;
      case "id":
        break;
      case "class":
        this.buttonElement.classList.add(value);
        break;
      case "variant":
        if (oldValue) {
          this.buttonElement.classList.remove(oldValue);
        }

        this.buttonElement.classList.add(value);
        break;
      default:
        this.buttonElement.setAttribute(name, value);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    this.setButtonAttribute(name, newValue, oldValue);
  }
}

customElements.define("i-button", Button);
