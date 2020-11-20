import store from '/state/index.js';
import { loadAndParseHtml } from '/loader.js';
import { getFeed } from '../../state/feed/thunks.js';
import {
  selectFeedPosts,
  selectRequestParams,
} from '../../state/feed/selectors.js';
import { setFeedParams } from '../../state/feed/actions.js';

import css from './feed.scss';

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
    store.subscribeWithSelector(selectFeedPosts, this.handleFeedChanged);
    store.subscribeWithSelector(selectRequestParams, this.handleParamsChanged);

    const input = this.querySelector('#input');
    input.value = 20;
    input.addEventListener('change', (event) => {
      const { value } = event.target;

      store.dispatch(
        setFeedParams({
          limit: value,
          offset: 0,
        })
      );
    });
  }

  disconnectedCallback() {
    store.unsubscribe(this.listener);
  }

  handleParamsChanged = (params) => {
    store.dispatch(getFeed(params));
  };

  handleFeedChanged = (feed) => {
    console.log(feed);
  };
}

customElements.define('feed-page', FeedPage);
