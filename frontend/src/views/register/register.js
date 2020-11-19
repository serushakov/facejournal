import css from "./register.scss";
import "/components/button/button.js";
import store from "/state/index.js";
import Router from "/router/Router.js";
import { register } from "../../state/auth/thunks.js";

class RegisterPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml("/views/register/register.html").then(this.setContent);
  }

  setContent = (document) => {
    const template = document.getElementById("register-page");
    this.appendChild(template.content.cloneNode(true));

    const style = document.createElement("style");
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  init = () => {
    this.form = this.querySelector("#register-form");
    this.form.addEventListener("submit", this.handleFormSubmit);

    store.subscribe(this.listener);
  };

  listener = (state) => {
    if (state.auth.user) {
      Router.navigate("/feed", { replace: true });
    }
  };

  disconnectedCallback = () => {
    store.unsubscribe(this.listener);
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(this.form);

    store.dispatch(
      register({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
      })
    );
  };
}

customElements.define("register-page", RegisterPage);
