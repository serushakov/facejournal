import css from './post-item.scss';
import resetCss from '../../styles/reset.scss';
import { loadAndParseHtml } from '/loader.js';

class PostItem extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/post-item/post-item.html').then(
      this.createShadowRoot
    );
  }

  createShadowRoot = (document) => {
    const template = document.getElementById('post-item');

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

  init() {}
}

customElements.define('post-item', PostItem);
