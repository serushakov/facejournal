import store from '/state/index.js';
import { loadAndParseHtml } from '/loader.js';
import { getFeed } from '../../state/feed/thunks.js';
import {
  selectFeedPosts,
  selectRequestParams,
} from '../../state/feed/selectors.js';
import '/components/post-item/post-item.js';
import '/components/create-post-form/create-post-form.js';
import { selectUser } from '../../state/auth/selectors.js';

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
    store.subscribeWithSelectors(this.handleFeedChanged, selectFeedPosts);

    this.createPostButton = this.querySelector('#create-post-button');
    this.createPostButton.addEventListener(
      'click',
      this.handleCreatePostButtonClick
    );

    this.createPostContainer = this.querySelector('#create-post-container');

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

  handleCreatePostButtonClick = () => {
    this.createPostButton.hidden = true;

    this.createPostForm = document.createElement('create-post-form');
    this.createPostContainer.appendChild(this.createPostForm);

    this.createPostForm.addEventListener('create', this.handlePostCreated);
    this.createPostForm.addEventListener('cancel', this.removeForm);
  };

  handlePostCreated = () => {
    store.dispatch(getFeed());
    this.removeForm();
  };

  removeForm = () => {
    this.createPostButton.hidden = false;

    this.createPostForm.remove();
  };

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

    const creatorImageSlot = document.createElement('img');
    creatorImageSlot.src = User.avatar;
    creatorImageSlot.slot = 'creator-avatar';

    postItem.append(
      titleSlot,
      textContentSlot,
      creatorNameSlot,
      creatorImageSlot
    );
    postItemContainer.appendChild(postItem);

    return postItemContainer;
  };
}

customElements.define('feed-page', FeedPage);
