import store from '../../state/index.js';
import css from './subscriptions.scss';
import resetCss from '../../styles/reset.scss';
import variablesCss from '../../styles/variables.scss';

import { loadAndParseHtml } from '/loader.js';
import { selectUser } from '../../state/auth/selectors.js';

class Subscriptions extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/subscriptions/subscriptions.html').then(
      this.mountRoot
    );
  }

  mountRoot = (document) => {
    const template = document.getElementById('subscriptions');

    this.attachShadow({ mode: 'open' }).append(
      template.content.cloneNode(true)
    );

    this.subItemTemplate = this.shadowRoot.querySelector('#subscription-item');
    this.subRoot = this.shadowRoot.querySelector('#subscriptions-root');

    this.loadStyle();
    this.init();
  };

  loadStyle = () => {
    const style = document.createElement('style');
    style.textContent = css + resetCss + variablesCss;

    this.shadowRoot.appendChild(style);
  };

  init = () => {
    store.subscribeWithSelectors(this.handleUserChange, selectUser);
  };

  handleUserChange = ([user]) => {
    if (!user) return;

    const { subscriptions } = user;

    this.clearSubscriptions();

    this.subRoot.append(...subscriptions.map(this.createSubscriptionItem));
  };

  clearSubscriptions = () => {
    this.subRoot.querySelectorAll('*').forEach((n) => {
      n.remove();
    });
  };

  createSubscriptionItem = ({ firstName, lastName, id, avatar }) => {
    console.log('create');
    const element = this.subItemTemplate.content.cloneNode(true);

    const anchorTag = element.querySelector('a');
    const span = element.querySelector('span');
    const image = anchorTag.querySelector('img');

    anchorTag.href = `/users/${id}`;
    span.textContent = `${firstName} ${lastName}`;
    image.src = avatar;

    return element;
  };
}

customElements.define('subscription-list', Subscriptions);
