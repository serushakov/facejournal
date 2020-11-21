import css from './create-post-form.scss';
import store from '../../state/index.js';
import resetCss from '../../styles/reset.scss';
import inputCss from '../../styles/input.scss';
import { loadAndParseHtml } from '/loader.js';
import { selectToken } from '../../state/auth/selectors.js';
import { getFeed } from '../../state/feed/thunks.js';

const MAX_TEXT_LENGTH = 3000;

class CreatePostForm extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/create-post-form/create-post-form.html').then(
      this.createShadowRoot
    );
  }

  createShadowRoot = (document) => {
    const template = document.getElementById('create-post-form');

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.loadStyle();
    this.init();
  };

  loadStyle = () => {
    const style = document.createElement('style');
    style.textContent = css + resetCss + inputCss;

    this.shadowRoot.appendChild(style);
  };

  init() {
    const textarea = this.shadowRoot.querySelector('#textarea');
    textarea.addEventListener('input', this.handleTextareaChange);
    textarea.setAttribute('maxlength', MAX_TEXT_LENGTH);

    this.form = this.shadowRoot.querySelector('#form');
    this.form.addEventListener('submit', this.handleFormSubmit);

    this.setCharcount();
  }

  setCharcount = (currentLength = 0) => {
    const charcount = this.shadowRoot.querySelector('#character-count');

    charcount.textContent = `${currentLength}/${MAX_TEXT_LENGTH}`;
  };

  handleTextareaChange = (event) => {
    const textarea = event.target;
    const { value } = textarea;

    if (value.lenght > MAX_TEXT_LENGTH) {
      value.length = MAX_TEXT_LENGTH;
      textarea.value = value;
    }
    this.setCharcount(value.length);
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(this.form);
    const token = selectToken(store.getState());

    await fetch('/api/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        title: formData.get('title'),
        text_content: formData.get('text-content'),
      }),
    });

    store.dispatch(getFeed());
  };
}

customElements.define('create-post-form', CreatePostForm);
