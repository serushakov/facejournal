import css from "./logo.scss";
import resetCss from "../../styles/reset.scss";

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

  loadStyle = () => {
    const style = document.createElement("style");
    style.textContent = css + resetCss;

    this.shadowRoot.appendChild(style);
  };
}

customElements.define("brand-logo", Logo);
