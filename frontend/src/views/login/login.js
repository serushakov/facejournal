import store from "/state/index.js";
import "/components/button/button.js";
import { loginSuccess } from "/state/auth/actions.js";

class LoginPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml("/views/login/login.html").then(this.setContent);
  }

  setContent = (document) => {
    const template = document.getElementById("login-page");
    this.appendChild(template.content.cloneNode(true));

    this.init();
    this.loadStyles();
  };

  init() {
    store.subscribe(this.listener);

    this.form = this.querySelector("#login-form");
    this.form.addEventListener("submit", this.handleFormSubmit);
  }

  async loadStyles() {
    const styles = await loadStyles("/views/login/login.css");

    this.appendChild(styles);
  }

  disconnectedCallback() {
    console.log("disconnect");
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

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(this.form);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const { user, token } = await response.json();

    store.dispatch(loginSuccess(user, token));

    localStorage.setItem("token", token);
  };
}

customElements.define("login-page", LoginPage);
