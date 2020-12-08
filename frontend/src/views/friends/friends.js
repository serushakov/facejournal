import store from '../../state/index.js';
import {
  selectIsUserInitialized,
  selectToken,
  selectUser,
} from '../../state/auth/selectors.js';
import { loadAndParseHtml } from '/loader.js';
import Router from '../../router/Router.js';

import '/components/user-item/user-item.js';

import css from './friends.scss';

class FriendsPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml('/views/friends/friends.html').then(this.setContent);
  }

  setContent = (loadedDocument) => {
    const template = loadedDocument.getElementById('friends-page');
    this.appendChild(template.content.cloneNode(true));

    const style = loadedDocument.createElement('style');
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  init() {
    store.subscribeWithSelectors(
      this.handleUserChange,
      selectUser,
      selectIsUserInitialized
    );
    store.subscribeWithSelectors(this.fetchFriends, selectToken);
    this.resultsRoot = this.querySelector('#results-root');
  }

  handleUserChange = ([user], [isInitialized]) => {
    if (!isInitialized) return;
    if (!user) return Router.navigate('/login');
  };

  fetchFriends = async ([token]) => {
    if (!token) return;
    const response = await fetch(`/api/users/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const results = await response.json();

    this.renderResults(results);
  };

  clearResults() {
    this.resultsRoot.querySelectorAll('*').forEach((n) => n.remove());
  }

  createUserItem = (user) => {
    const container = document.createElement('div');
    const userItem = document.createElement('user-item');

    const img = document.createElement('img');
    img.src = user.avatar;
    img.slot = 'avatar';

    const fullName = document.createElement('span');
    fullName.innerText = `${user.firstName} ${user.lastName}`;
    fullName.slot = 'full-name';

    const email = document.createElement('span');
    email.innerText = user.email;
    email.slot = 'email';

    const createdAt = document.createElement('span');
    const date = new Date(user.createdAt);
    createdAt.innerText = date.toLocaleDateString();
    createdAt.slot = 'created-at';

    userItem.href = `/users/${user.id}`;

    userItem.append(img, fullName, email, createdAt);

    container.append(userItem);
    container.classList.add('friends-page__user-item');

    return container;
  };

  renderResults(results) {
    const elements = results.map(this.createUserItem);

    this.clearResults();
    this.resultsRoot.append(...elements);
  }
}

customElements.define('friends-page', FriendsPage);
