import store from '../../state/index.js';
import {
  selectIsUserInitialized,
  selectToken,
  selectUser,
} from '../../state/auth/selectors.js';
import { loadAndParseHtml } from '/loader.js';
import '/components/post-item/post-item.js';

import css from './profile.scss';
import { fetchUser, fetchUserPosts } from '../../state/profile/thunks.js';
import {
  selectProfile,
  selectProfilePostsState,
} from '../../state/profile/selectors.js';

class ProfilePage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml('/views/profile/profile.html').then(this.setContent);
  }

  connectedCallback() {
    this.mounted = true;

    this.init();
  }

  set params(value) {
    this.routeParams = value;

    this.init();
  }

  setContent = (document) => {
    const template = document.getElementById('profile-page');
    this.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  async init() {
    if (!this.mounted) return;
    this.postsRoot = this.querySelector('#posts-root');
    this.profileContainer = this.querySelector('#profile-container');

    store.subscribeWithSelectors(
      this.handleCurrentUserChange,
      selectIsUserInitialized,
      selectToken,
      selectUser
    );

    store.subscribeWithSelectors(this.handleUserChange, selectProfile);
    store.subscribeWithSelectors(
      this.handlePostsChange,
      selectProfilePostsState
    );
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleCurrentUserChange);
    store.unsubscribe(this.handleUserChange);
    store.unsubscribe(this.handlePostsChange);
  }

  fetchUser = () => {
    store.dispatch(fetchUser(this.routeParams.id));
  };

  handleCurrentUserChange = async ([isInitialized], [token], [currentUser]) => {
    if (!isInitialized) return;

    if (currentUser) {
      this.currentUserId = currentUser.id;
    }

    if (token) {
      this.token = token;
    }

    this.fetchUser();
  };

  handleUserChange = ([user, prevUser]) => {
    if (!user) return;
    this.user = user;

    this.renderUser();
    this.renderFriendButton();

    // fetch posts only when id changes
    if (!prevUser?.id || prevUser.id !== user.id) {
      this.fetchPosts();
    }
  };

  handlePostsChange = ([posts]) => {
    if (!posts.content) return;
    this.posts = posts;
    this.renderPosts();
  };

  fetchPosts = () => {
    store.dispatch(fetchUserPosts(this.routeParams.id));
  };

  renderFriendButton = () => {
    const { user, currentUserId } = this;

    this.removeFriendButton();
    if (user.id === currentUserId) return;

    const button = document.createElement('i-button');
    button.classList.add('profile-page__header__button');

    const text = document.createElement('span');
    text.slot = 'text';

    switch (user.friendshipStatus) {
      case 'friend':
        button.setAttribute('variant', 'secondary');
        text.innerText = 'Remove from friends';
        break;
      case 'pending':
        button.setAttribute('variant', 'secondary');
        text.innerText = 'Cancel friendship request';
        break;
      case 'none':
        button.setAttribute('variant', 'primary');
        text.innerText = 'Add friend';
        break;
      default:
    }

    button.appendChild(text);
    this.friendButton = button;

    button.addEventListener(
      'click',
      this.createButtonClickHandler(user.friendshipStatus)
    );

    this.profileContainer.append(button);
  };

  removeFriendButton() {
    if (!this.friendButton) return;
    this.friendButton.remove();
  }

  createButtonClickHandler = (friendshipStatus) => async () => {
    switch (friendshipStatus) {
      case 'none':
        await fetch('/api/users/friend', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.user.id,
          }),
        });

        break;
      case 'friend':
      case 'pending':
        await fetch('/api/users/friend', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.user.id,
          }),
        });
        break;
      default:
    }
    this.fetchUser();
  };

  renderUser() {
    const {
      coverImage,
      firstName,
      lastName,
      avatar,
      email,
      createdAt,
    } = this.user;

    const coverImageElement = this.querySelector('#cover-image');
    coverImageElement.style.backgroundImage = `url(${coverImage})`;

    const avatarElement = this.querySelector('#avatar');
    avatarElement.src = avatar;

    const fullNameElement = this.querySelector('#full-name');
    fullNameElement.innerText = `${firstName} ${lastName}`;

    const emailElement = this.querySelector('#email');
    emailElement.innerText = email;

    const createdAtElement = this.querySelector('#created-at');
    createdAtElement.innerText = new Date(createdAt).toLocaleDateString();
  }

  createPostItem = (post) => {
    const postItemContainer = document.createElement('div');
    postItemContainer.classList.add('profile-page__posts__item');

    const postItem = document.createElement('post-item');

    postItem.post = post;
    postItemContainer.appendChild(postItem);

    postItem.addEventListener('invalidate', this.fetchPosts);

    return postItemContainer;
  };

  clearPosts() {
    this.postsRoot.querySelectorAll('*').forEach((n) => n.remove());
  }

  renderPosts() {
    const { count, rows } = this.posts.content;

    this.clearPosts();

    if (rows.length) {
      const elements = rows.map(this.createPostItem);
      this.postsRoot.append(...elements);

      return;
    }

    const empty = document.createElement('p');
    empty.classList.add('profile-page__posts__empty');
    empty.innerText = 'Very quiet in here... Nothing has been posted yet';

    this.postsRoot.append(empty);
  }
}

customElements.define('profile-page', ProfilePage);
