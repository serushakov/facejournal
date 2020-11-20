import store from '/state/index.js';
import '/components/button/button.js';
import { login } from '/state/auth/thunks.js';
import Router from '/router/Router.js';
import { loadAndParseHtml } from '/loader.js';

import css from './login.scss';

class LoginPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml('/views/login/login.html').then(this.setContent);
  }

  setContent = (document) => {
    const template = document.getElementById('login-page');
    this.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  init() {
    store.subscribe(this.listener);

    this.form = this.querySelector('#login-form');
    this.form.addEventListener('submit', this.handleFormSubmit);
  }

  disconnectedCallback() {
    store.unsubscribe(this.listener);
  }

  listener = ({ auth: { user } }) => {
    if (user) {
      Router.navigate('/feed', { replace: true });
    }
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(this.form);

    store.dispatch(login(formData.get('email'), formData.get('password')));
  };
}

customElements.define('login-page', LoginPage);
