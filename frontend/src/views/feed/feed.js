import store from '/state/index.js';
import { loadAndParseHtml } from '/loader.js';

import css from './feed.scss';
import { getFeed } from '../../state/feed/thunks.js';

class FeedPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml('/views/feed/feed.html').then(this.setContent);
  }

  setContent = (loadedDocument) => {
    const template = loadedDocument.getElementById('feed-page');
    this.appendChild(template.content.cloneNode(true));

    const style = loadedDocument.createElement('style');
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  init() {
    store.subscribe(this.listener);

    store.dispatch(getFeed({}));
  }

  disconnectedCallback() {
    store.unsubscribe(this.listener);
  }

  listener = (state) => {
    console.log(state.feed);
  };
}

customElements.define('feed-page', FeedPage);
