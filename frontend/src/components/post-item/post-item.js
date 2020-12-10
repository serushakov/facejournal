import store from '../../state/index.js';
import css from './post-item.scss';
import resetCss from '../../styles/reset.scss';
import variablesCss from '../../styles/variables.scss';
import { loadAndParseHtml } from '/loader.js';
import nav from '../../router/nav-module.js';
import { selectToken } from '../../state/auth/selectors.js';

import '../tooltip/tooltip.js';

const LIKE_BUTTON_TEXT = {
  [false]: '👍 Like',
  [true]: '👎 Unlike',
};

class PostItem extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/post-item/post-item.html').then(
      this.createShadowRoot
    );
  }

  mediaIndex = 0;

  static observedAttributes = ['href'];

  get href() {
    return this.getAttribute('href');
  }

  set href(value) {
    this.setAttribute('href', value);
  }

  get post() {
    return this.postItem;
  }

  set post(value) {
    this.postItem = value;
    this.fillSlots();
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
    style.textContent = css + resetCss + variablesCss;

    this.shadowRoot.appendChild(style);
  };

  attributeChangedCallback(name) {
    if (name === 'href') {
      this.setCreatorHref();
    }
  }

  init = () => {
    this.mediaRoot = this.shadowRoot.querySelector('#media-root');
    this.creator = this.shadowRoot.querySelector('#creator');
    this.likeCount = this.shadowRoot.querySelector('#like-count');
    this.likeButton = this.shadowRoot.querySelector('#like-button');

    this.likeButton.addEventListener('click', this.handleLikeClick);

    this.creator.addEventListener('click', nav);

    if (this.post) {
      this.fillSlots();
    }

    if (this.media) {
      this.displayMedia();
    }
  };

  fillSlots() {
    if (!this.shadowRoot) return;

    const { title, textContent, creator, media, likes, isLiked } = this.post;

    const titleSlot = document.createElement('span');
    titleSlot.textContent = title;
    titleSlot.slot = 'title';

    const textContentSlot = document.createElement('p');
    textContentSlot.textContent = textContent;
    textContentSlot.slot = 'text-content';

    let creatorImageSlot;
    let creatorNameSlot;

    if (this.getAttribute('with-creator')) {
      creatorNameSlot = document.createElement('span');
      creatorNameSlot.textContent = `${creator.firstName} ${creator.lastName}`;
      creatorNameSlot.slot = 'creator-name';

      creatorImageSlot = document.createElement('img');
      creatorImageSlot.src = creator.avatar;
      creatorImageSlot.slot = 'creator-avatar';

      this.creator.href = `/users/${creator.id}`;

      this.creator.style.display = '';
    } else {
      this.creator.style.display = 'none';
    }

    this.likeCount.innerText = `${likes} ${likes === 1 ? 'like' : 'likes'}`;

    if (media.length) {
      this.setMedia(media);
    }

    if (typeof isLiked !== 'undefined') {
      this.likeButton.innerText = LIKE_BUTTON_TEXT[isLiked];
      this.likeButton.classList.add(isLiked ? 'dislike' : 'like');
    }

    this.append(titleSlot, textContentSlot, creatorNameSlot, creatorImageSlot);

    this.append();
  }

  setMedia = (media) => {
    this.media = media;

    if (this.mediaRoot) {
      this.displayMedia();
    }
  };

  displayMedia = () => {
    if (!this.mediaRoot) this.createMediaRoot();
    this.mediaRoot.innerHTML = '';

    const mediaItem = this.media[this.mediaIndex];
    const element = this.createMediaElement(mediaItem);
    element.src = mediaItem.url;

    this.mediaRoot.appendChild(element);
  };

  createMediaRoot = () => {
    const template = this.shadowRoot.querySelector('#media');

    const mediaElement = template.content.cloneNode(true);

    this.shadowRoot.querySelector('#content').prepend(mediaElement);

    this.mediaRoot = this.shadowRoot.querySelector('#media-root');

    this.prevNextButtons = this.shadowRoot.querySelectorAll(
      '.post-item__content__media__button'
    );

    this.prevNextButtons.forEach((button) =>
      button.addEventListener('click', this.handlePrevNextButtonClick)
    );

    if (this.media.length > 1) {
      this.prevNextButtons.forEach((node) => node.classList.add('visible'));
    }
  };

  handleLikeClick = async () => {
    const token = selectToken(store.getState());

    await fetch(`/api/posts/post/${this.post.id}/like`, {
      method: this.post.isLiked ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.dispatchEvent(new Event('invalidate'));
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
