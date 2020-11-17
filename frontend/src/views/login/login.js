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

  async loadStyles() {
    const styles = await loadStyles("/views/login/login.css");

    this.appendChild(styles);
  }

  disconnectedCallback() {
    console.log("disconnect");
    store.unsubscribe(this.listener);
  }

  listener(state) {}

  init() {
    store.subscribe(this.listener);

    this.form = this.querySelector("#login-form");
    this.form.addEventListener("submit", this.handleFormSubmit);
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
