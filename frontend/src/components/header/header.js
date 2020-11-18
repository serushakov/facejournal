import store from "/state/index.js";
import Router from "/router/Router.js";
import { logout } from "/state/auth/thunks.js";

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
    this.loggedInStateContainer = this.shadowRoot.querySelector(
      "#logged-in-state"
    );
    this.loggedOutStateContainer = this.shadowRoot.querySelector(
      "#logged-out-state"
    );
    this.usernameContainer = this.shadowRoot.querySelector("#username");

    this.shadowRoot.getElementById("login").addEventListener("click", () => {
      Router.navigate("/login");
    });
    this.shadowRoot.getElementById("register").addEventListener("click", () => {
      Router.navigate("/register");
    });
    this.shadowRoot.querySelector("#logout").addEventListener("click", () => {
      store.dispatch(logout());
    });

    store.subscribe(this.listener);
  }

  disconnectedCallback() {
    store.unsubscribe(this.listener);
  }

  listener = ({ auth: { user } }) => {
    if (user) {
      this.showLoggedInState(user);
    } else {
      this.showLoggedOutState();
    }
  };

  showLoggedInState = ({ firstName, lastName }) => {
    const fullName = `${firstName} ${lastName}`;

    this.loggedInStateContainer.classList.remove("hidden");
    this.loggedOutStateContainer.classList.add("hidden");
    this.usernameContainer.textContent = fullName;
  };

  showLoggedOutState = () => {
    this.loggedInStateContainer.classList.add("hidden");
    this.loggedOutStateContainer.classList.remove("hidden");
    this.usernameContainer.textContent = "";
  };

  loadStyle = async () => {
    this.shadowRoot.append(
      await loadStyles("/components/header/header.css"),
      await loadStyles("/reset.css")
    );
  };
}

customElements.define("i-header", Header);
