import store from '../../state/index.js';
import { loadAndParseHtml } from '/loader.js';
import { getFeed } from '../../state/feed/thunks.js';
import Router from '../../router/Router.js';
import {
  selectFeedPosts,
  selectRequestParams,
} from '../../state/feed/selectors.js';
import '/components/post-item/post-item.js';
import '/components/create-post-form/create-post-form.js';
import { selectUser } from '../../state/auth/selectors.js';
import nav from '../../router/nav-module.js';

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

    this.feedRoot = this.querySelector('#feed');
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

    this.renderFeed();
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
    if (!user) {
      Router.navigate('/login');
    }

    store.dispatch(getFeed(params));
  };

  handleFeedChanged = ([feed]) => {
    if (!feed) return;
    this.feed = feed;
    this.renderFeed();
  };

  renderFeed() {
    if (!this.feedRoot || !this.feed) return;
    this.feedRoot.querySelectorAll('*').forEach((n) => n.remove());

    if (this.feed.length === 0) {
      this.showEmptyState();
    } else {
      const feedElements = this.feed.map(this.createPostItem);

      this.feedRoot.append(...feedElements);
    }
  }

  showEmptyState() {
    const emptySpan = document.createElement('p');
    emptySpan.innerHTML = `It is quiet in here! Find someone to follow by clicking `;
    emptySpan.classList.add('feed-page__empty');

    const link = document.createElement('a');
    link.href = '/search';
    link.innerText = 'here';
    link.addEventListener('click', nav);

    emptySpan.append(link);

    this.feedRoot.append(emptySpan);
  }

  shouldShowPostMenu = (post) => {
    const user = selectUser(store.getState());

    return (
      post.creator.id === user.id || user.permissions.includes('post.delete')
    );
  };

  createPostItem = (post) => {
    const postItemContainer = document.createElement('div');
    postItemContainer.classList.add('feed-page__item');

    const postItem = document.createElement('post-item');
    postItem.setAttribute('with-creator', true);

    postItem.post = post;
    const shouldShowMenu = this.shouldShowPostMenu(post);
    postItem.showMenu = shouldShowMenu;

    postItem.addEventListener('invalidate', () => store.dispatch(getFeed()));
    postItemContainer.appendChild(postItem);

    return postItemContainer;
  };
}

customElements.define('feed-page', FeedPage);
