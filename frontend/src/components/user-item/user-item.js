import { loadAndParseHtml } from '/loader.js';
import nav from '/router/nav-module.js';

import css from './user-item.scss';
import resetCss from '../../styles/reset.scss';
import stylesCss from '../../styles/styles.scss';
import variablesCss from '../../styles/variables.scss';

class UserItem extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/user-item/user-item.html').then(
      this.createShadowRoot
    );
  }

  set href(value) {
    this.setAttribute('href', value);
  }

  static get observedAttributes() {
    return ['href'];
  }

  attributeChangedCallback(name) {
    switch (name) {
      case 'href':
        this.setHref();
        break;
      default:
    }
  }

  createShadowRoot = (document) => {
    const template = document.getElementById('user-item');

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
    this.init();
  };

  loadStyle = () => {
    const style = document.createElement('style');
    style.textContent = css + resetCss + stylesCss + variablesCss;

    this.shadowRoot.appendChild(style);
  };

  init() {
    this.anchor = this.shadowRoot.querySelector('#anchor');
    this.anchor.addEventListener('click', nav);

    this.setHref();
  }

  setHref() {
    if (!this.anchor) return;

    this.anchor.setAttribute('href', this.getAttribute('href'));
  }
}

customElements.define('user-item', UserItem);
