import store from '/state/index.js';
import { loadAndParseHtml } from '/loader.js';

import '/components/post-item/post-item.js';
import '/components/create-post-form/create-post-form.js';

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
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();

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

  renderResults(results) {
    const elements = results.rows.map((user) => {
      const div = document.createElement('div');

      div.innerText = `${user.firstName}, ${user.lastName}, ${user.email}`;

      return div;
    });

    this.clearResults();
    this.resultsRoot.append(...elements);
  }
}

customElements.define('search-page', SearchPage);
