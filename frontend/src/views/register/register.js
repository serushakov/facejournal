import '/components/button/button.js';
import store from '../../state/index.js';
import { loadAndParseHtml } from '/loader.js';
import Router from '/router/Router.js';
import { register } from '/state/auth/thunks.js';
import '/components/user-hero-banner/user-hero-banner.js';
import { selectConfig } from '../../state/config/selectors.js';

import css from './register.scss';

class RegisterPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml('/views/register/register.html').then(this.setContent);
  }

  setContent = (document) => {
    const template = document.getElementById('register-page');
    this.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  init = () => {
    this.form = this.querySelector('#register-form');
    this.form.addEventListener('submit', this.handleFormSubmit);

    this.previewBanner = this.querySelector('#preview-banner');

    store.subscribe(this.listener);
    store.subscribeWithSelectors(this.handleConfigChange, selectConfig);

    this.firstName = this.querySelector('#firstName');
    this.lastName = this.querySelector('#lastName');
    this.email = this.querySelector('#email');
    this.avatar = this.querySelector('#avatar');
    this.background = this.querySelector('#background');

    this.previewName = this.querySelector('#preview-name');
    this.previewEmail = this.querySelector('#preview-email');

    this.firstName.addEventListener('input', this.handleInputChange);
    this.lastName.addEventListener('input', this.handleInputChange);
    this.email.addEventListener('input', this.handleInputChange);
    this.avatar.addEventListener('change', this.handleInputChange);
    this.background.addEventListener('change', this.handleInputChange);
  };

  handleInputChange = (event) => {
    switch (event.target.name) {
      case 'firstName':
      case 'lastName':
        this.setFullNamePreview();
        break;
      case 'email':
        this.setEmailPreview();
        break;
      case 'avatar':
        this.setAvatarPreview();
        break;
      case 'background':
        this.setBackgroundPreview();
        break;
      default:
    }
  };

  setFullNamePreview() {
    this.previewName.innerText = `${
      this.firstName.value || this.firstName.placeholder
    } ${this.lastName.value || this.lastName.placeholder}`;
  }

  setEmailPreview() {
    this.previewEmail.innerText = this.email.value || this.email.placeholder;
  }

  listener = (state) => {
    if (state.auth.user) {
      Router.navigate('/feed', { replace: true });
    }
  };

  handleConfigChange = ([config]) => {
    this.config = config;
    if (!config) return;

    this.setImages(config.defaults.avatar, config.defaults.background);
  };

  toBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });

  async setAvatarPreview() {
    const base64Url = await this.toBase64(this.avatar.files[0]);

    this.previewBanner.setAttribute('avatar-url', base64Url);
  }

  async setBackgroundPreview() {
    const base64Url = await this.toBase64(this.background.files[0]);

    this.previewBanner.setAttribute('background-url', base64Url);
  }

  setImages(avatar, background) {
    if (!this.previewBanner) return;

    if (avatar) {
      this.previewBanner.setAttribute('avatar-url', avatar);
    }

    if (background) {
      this.previewBanner.setAttribute('background-url', background);
    }
  }

  disconnectedCallback = () => {
    store.unsubscribe(this.listener);
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(this.form);

    store.dispatch(
      register({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
      })
    );
  };
}

customElements.define('register-page', RegisterPage);
