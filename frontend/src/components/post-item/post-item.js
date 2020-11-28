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

  init = () => {
    this.mediaRoot = this.shadowRoot.querySelector('#media-root');
    this.prevNextButtons = this.shadowRoot.querySelectorAll(
      '.post-item__content__media__button'
    );

    this.prevNextButtons.forEach((button) =>
      button.addEventListener('click', this.handlePrevNextButtonClick)
    );

    if (this.media) {
      this.mediaIndex = 0;
      this.displayMedia();

      if (this.media.length > 1) {
        this.prevNextButtons.forEach((node) => node.classList.add('visible'));
      }
    }
  };

  setMedia = (media) => {
    this.media = media;
  };

  displayMedia = () => {
    this.mediaRoot.innerHTML = '';

    const mediaItem = this.media[this.mediaIndex];
    const element = this.createMediaElement(mediaItem);
    element.src = mediaItem.url;

    this.mediaRoot.appendChild(element);
  };

  handlePrevNextButtonClick = ({ target }) => {
    switch (target.getAttribute('data-action')) {
      case 'prev':
        if (this.mediaIndex === 0) {
          this.mediaIndex = this.media.length - 1;
        }
        this.mediaIndex -= 1;
        break;
      case 'next':
        this.mediaIndex = (this.mediaIndex + 1) % this.media.length;
        break;
      default:
    }

    this.displayMedia();
  };

  createMediaElement = (mediaItem) => {
    switch (mediaItem.type) {
      case 'video': {
        const element = document.createElement('video');
        element.controls = 'true';
        element.classList.add('video');

        return element;
      }
      case 'image':
        return document.createElement('img');
      default:
    }
  };
}

customElements.define('post-item', PostItem);
