import store from "/state/index.js";
import Router from "/router/Router.js";

import * as actions from "/state/auth/actions.js";

class Header extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml("/components/header/header.html").then(
      this.createShadowRoot
    );
  }

  createShadowRoot = (document) => {
    const template = document.getElementById("header");

    this.attachShadow({
      mode: "open",
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
    this.init();
  };

  init() {
    store.subscribe(this.listener);

    this.shadowRoot.getElementById("login").addEventListener("click", () => {
      Router.navigate("/login");
    });
    this.shadowRoot.getElementById("register").addEventListener("click", () => {
      Router.navigate("/register");
    });
  }

  disconnectedCallback() {
    store.unsubscribe(this.listener);
  }

  listener = (state) => {
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
