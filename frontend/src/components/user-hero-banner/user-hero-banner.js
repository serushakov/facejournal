import css from './user-hero-banner.scss';
import resetCss from '../../styles/reset.scss';
import variablesCss from '../../styles/variables.scss';
import { loadAndParseHtml } from '/loader.js';

class UserHeroBanner extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/user-hero-banner/user-hero-banner.html').then(
      this.mountRoot
    );
  }

  static observedAttributes = ['avatar-url', 'background-url'];

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case 'avatar-url':
        this.setAvatarImage(newValue);
        break;
      case 'background-url':
        this.setBackgroundImage(newValue);
        break;
      default:
    }
  }

  mountRoot = (document) => {
    const template = document.getElementById('user-hero-banner');

    this.attachShadow({ mode: 'open' }).append(
      template.content.cloneNode(true)
    );

    this.loadStyle();
    this.init();
  };

  loadStyle = () => {
    const style = document.createElement('style');
    style.textContent = css + resetCss + variablesCss;

    this.shadowRoot.appendChild(style);
  };

  init = () => {
    this.avatar = this.shadowRoot.querySelector('#avatar');
    this.backgroundImage = this.shadowRoot.querySelector('#cover-image');

    this.setAvatarImage(this.getAttribute('avatar-url'));
    this.setAvatarImage(this.getAttribute('background-url'));
  };

  setAvatarImage(value) {
    if (!this.shadowRoot) return;

    this.avatar.src = value;
  }

  setBackgroundImage(value) {
    if (!this.shadowRoot) return;

    this.backgroundImage.style.backgroundImage = `url(${value})`;
  }
}

customElements.define('user-hero-banner', UserHeroBanner);
