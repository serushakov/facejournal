import store from '/state/index.js';
import { loadAndParseHtml } from '/loader.js';

import '/components/user-item/user-item.js';

import css from './search.scss';

class SearchPage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml('/views/search/search.html').then(this.setContent);
  }

  setContent = (loadedDocument) => {
    const template = loadedDocument.getElementById('search-page');
    this.appendChild(template.content.cloneNode(true));

    const style = loadedDocument.createElement('style');
    style.textContent = css;
    this.appendChild(style);

    this.init();
  };

  init() {
    this.form = this.querySelector('#search-form');
    this.resultsRoot = this.querySelector('#results-root');

    this.form.addEventListener('submit', this.handleFormSubmit);

    this.handleFormSubmit();
  }

  handleFormSubmit = async (event) => {
    event?.preventDefault();

    const formData = new FormData(this.form);
    const query = new URLSearchParams();
    query.set('q', formData.get('query'));

    const response = await fetch(`/api/users/search?${query.toString()}`);
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
    container.classList.add('search-page__user-item');

    return container;
  };

  renderResults(results) {
    const elements = results.rows.map(this.createUserItem);

    this.clearResults();
    this.resultsRoot.append(...elements);
  }
}

customElements.define('search-page', SearchPage);
