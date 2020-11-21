import store from '/state/index.js';
import { loadAndParseHtml } from '/loader.js';
import { getFeed } from '../../state/feed/thunks.js';
import {
  selectFeedPosts,
  selectRequestParams,
} from '../../state/feed/selectors.js';
import { setFeedParams } from '../../state/feed/actions.js';
import '/components/post-item/post-item.js';

import css from './feed.scss';
import { selectUser } from '../../state/auth/selectors.js';

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
    store.subscribeWithSelectors(this.handleFeedChanged, selectFeedPosts);

    store.subscribeWithSelectors(
      this.handleParamsChanged,
      selectRequestParams,
      selectUser
    );
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleFeedChanged);
    store.unsubscribe(this.handleParamsChanged);
  }

  handleParamsChanged = ([params], [user]) => {
    if (!user) return;

    store.dispatch(getFeed(params));
  };

  handleFeedChanged = ([feed]) => {
    if (!feed) return;

    const feedElements = feed.map(this.createPostItem);

    const feedRoot = this.querySelector('#feed');
    feedRoot.innerHTML = '';
    feedRoot.append(...feedElements);
  };

  createPostItem = (post) => {
    const { title, textContent, User } = post;

    const postItemContainer = document.createElement('div');
    postItemContainer.classList.add('feed-page__item');

    const postItem = document.createElement('post-item');

    const titleSlot = document.createElement('span');
    titleSlot.textContent = title;
    titleSlot.slot = 'title';

    const textContentSlot = document.createElement('p');
    textContentSlot.textContent = textContent;
    textContentSlot.slot = 'text-content';

    const creatorNameSlot = document.createElement('span');
    creatorNameSlot.textContent = `${User.firstName} ${User.lastName}`;
    creatorNameSlot.slot = 'creator-name';

    postItem.append(titleSlot, textContentSlot, creatorNameSlot);
    postItemContainer.appendChild(postItem);

    return postItemContainer;
  };
}

customElements.define('feed-page', FeedPage);
