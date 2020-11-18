import store from "/state/index.js";
import "/components/button/button.js";
import { login } from "/state/auth/thunks.js";

import css from "./login.scss";

class LoginPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml("/views/login/login.html").then(this.setContent);
  }

  setContent = (document) => {
    const template = document.getElementById("login-page");
    this.appendChild(template.content.cloneNode(true));

    const style = document.createElement("style");
    style.innerText = css;
    this.appendChild(style);

    this.init();
  };

  init() {
    store.subscribe(this.listener);

    this.form = this.querySelector("#login-form");
    this.form.addEventListener("submit", this.handleFormSubmit);
  }

  disconnectedCallback() {
    store.unsubscribe(this.listener);
  }

  listener = (state) => {
    const { user } = state.auth;
    if (user) {
      this.displayLoggedInState(user);
    } else {
      this.displayLoggedOutState();
    }
  };

  displayLoggedInState(user) {
    const loggedInState = this.querySelector("#logged-in-view");
    const form = this.querySelector("#login-form");

    loggedInState.classList.add("visible");
    form.classList.add("hidden");

    const userName = `${user.firstName} ${user.lastName}`;

    const title = this.querySelector("#user-name");
    title.textContent = `Hello, ${userName} 👋`;
  }

  displayLoggedOutState() {
    const loggedInState = this.querySelector("#logged-in-view");
    const form = this.querySelector("#login-form");

    loggedInState.classList.remove("visible");
    form.classList.remove("hidden");
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(this.form);

    store.dispatch(login(formData.get("email"), formData.get("password")));
  };
}

customElements.define("login-page", LoginPage);
