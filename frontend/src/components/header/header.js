import store from "/state/index.js";
import * as actions from "/state/auth/actions.js";

class Header extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("header");
    const shadowRoot = this.attachShadow({
      mode: "open",
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
  }

  connectedCallback() {
    store.subscribe(this.storeCallback);

    this.shadowRoot.getElementById("login").addEventListener("click", () => {
      history.pushState(null, null, "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    this.shadowRoot.getElementById("register").addEventListener("click", () => {
      history.pushState(null, null, "/register");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
  }

  storeCallback = (state) => {
    console.log(state.auth);
  };

  loadStyle = async () => {
    this.shadowRoot.append(
      await loadStyles("/components/header/header.css"),
      await loadStyles("/reset.css")
    );
  };
}

customElements.define("i-header", Header);
