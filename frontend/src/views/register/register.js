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

  step = 1;

  setContent = (document) => {
    const template = document.getElementById('register-page');
    this.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  init = () => {
    this.root = this.querySelector('#root');
    store.subscribe(this.listener);
    store.subscribeWithSelectors(this.handleConfigChange, selectConfig);
    this.renderStep();
  };

  handleConfigChange = ([config]) => {
    this.config = config;
    if (!config) return;

    this.setImages(config.defaults.avatar, config.defaults.background);
  };

  listener = (state) => {
    if (state.auth.user) {
      Router.navigate('/feed', { replace: true });
    }
  };

  setStep(step) {
    this.step = step;

    this.renderStep();
  }

  renderStep() {
    this.root.querySelectorAll('*').forEach((n) => n.remove());
    switch (this.step) {
      case 1:
        this.renderStep1();
        break;
      case 2:
        this.renderStep2();
        break;
      default:
    }
  }

  renderStep1() {
    const tempate = this.querySelector('#step-1');
    const content = tempate.content.cloneNode(true);
    this.root.append(content);

    this.form = this.root.querySelector('#register-form');
    this.form.addEventListener('submit', this.finishStep1);

    if (this.formData) {
      this.refillUserForm();
    }
  }

  renderStep2() {
    const tempate = this.querySelector('#step-2');
    const content = tempate.content.cloneNode(true);
    this.root.append(content);

    this.form = this.querySelector('#images-form');
    this.previewBanner = this.querySelector('#preview-banner');
    this.previewName = this.querySelector('#preview-name');
    this.previewEmail = this.querySelector('#preview-email');
    this.avatar = this.querySelector('#avatar');
    this.background = this.querySelector('#background');

    this.avatar.addEventListener('change', this.handleInputChange);
    this.background.addEventListener('change', this.handleInputChange);

    this.querySelector('#back').addEventListener('click', this.handleClickBack);
    this.querySelector('#send').addEventListener('click', this.finishStep2);

    this.setPreview();
  }

  finishStep1 = async (event) => {
    event.preventDefault();

    this.formData = new FormData(this.form);

    const response = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.formData.get('email') }),
    });

    if (response.status === 400) {
      const error = await response.json();

      this.querySelector('#email-error').innerText = error[0].msg;
      return;
    }

    this.setStep(2);
  };

  finishStep2 = () => {
    const files = new FormData(this.form);

    files.forEach((value, key) => {
      this.formData.set(key, value);
    });
    this.querySelector('#overlay').classList.add('show');

    store
      .dispatch(
        register(this.formData, (percentage) => {
          this.querySelector('#loader').value = percentage;
        })
      )
      .catch((error) => {
        this.querySelector('#overlay').classList.remove('show');
        this.querySelector('#error').innerText = error[0].msg;
      });
  };

  handleClickBack = () => {
    this.setStep(1);
  };

  refillUserForm = () => {
    this.formData.forEach((value, key) => {
      this.querySelector(`[name="${key}"]`).value = value;
    });
  };

  setPreview() {
    this.previewName.innerText = `${this.formData.get(
      'firstName'
    )} ${this.formData.get('lastName')}`;

    this.previewEmail.innerText = this.formData.get('email');

    this.setImages(
      this.config.defaults.avatar,
      this.config.defaults.background
    );
  }

  handleInputChange = (event) => {
    switch (event.target.name) {
      case 'avatar':
        this.setAvatarPreview();
        break;
      case 'background':
        this.setBackgroundPreview();
        break;
      default:
    }
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

  disconnectedCallback() {
    store.unsubscribe(this.listener);
    store.unsubscribe(this.handleConfigChange);
  }
}

customElements.define('register-page', RegisterPage);
