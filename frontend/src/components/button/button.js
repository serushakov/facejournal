import css from './button.scss';
import resetCss from '../../styles/reset.scss';
import { loadAndParseHtml } from '/loader.js';

class Button extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/button/button.html').then(
      this.createShadowRoot
    );
  }

  createShadowRoot = (document) => {
    const template = document.getElementById('button');

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
    this.init();
  };

  loadStyle = () => {
    const style = document.createElement('style');
    style.textContent = css + resetCss;

    this.shadowRoot.appendChild(style);
  };

  init() {
    this.buttonElement = this.shadowRoot.getElementById('button');

    for (const attribute of Array.from(this.attributes)) {
      this.setButtonAttribute(attribute.name, attribute.value);
    }

    this.addEventListener('click', this.handleClick);
  }

  handleClick = () => {
    if (this.submitButton) {
      this.submitButton.click();
    }
  };

  setButtonAttribute(name, value, oldValue) {
    switch (name) {
      case 'type':
        if (value === 'submit') {
          this.submitButton = document.createElement('button');
          this.submitButton.type = 'submit';
          this.submitButton.hidden = 'true';

          this.append(this.submitButton);
        }
        break;
      case 'id':
        break;
      case 'class':
        break;
      case 'variant':
        if (oldValue) {
          this.buttonElement.classList.remove(oldValue);
        }

        this.buttonElement.classList.add(value);
        break;
      case 'size':
        if (oldValue) {
          this.buttonElement.classList.remove(oldValue);
        }

        this.buttonElement.classList.add(value);
        break;
      default:
        this.buttonElement.setAttribute(name, value);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.setButtonAttribute(name, newValue, oldValue);
  }
}

customElements.define('i-button', Button);
