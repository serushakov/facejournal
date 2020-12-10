import store from '../../state/index.js';
import css from './subscriptions.scss';
import resetCss from '../../styles/reset.scss';
import variablesCss from '../../styles/variables.scss';
import nav from '../../router/nav-module.js';
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

    this.loadStyle();
    this.init();
  };

  loadStyle = () => {
    const style = document.createElement('style');
    style.textContent = css + resetCss + variablesCss;

    this.shadowRoot.appendChild(style);
  };

  init = () => {
    this.subItemTemplate = this.shadowRoot.querySelector('#subscription-item');
    this.subRoot = this.shadowRoot.querySelector('#subscriptions-root');
    this.root = this.shadowRoot.querySelector('#root');

    store.subscribeWithSelectors(this.handleUserChange, selectUser);
    window.addEventListener('popstate', this.handleLocationChange);
  };

  handleLocationChange = () => {
    this.render();
  };

  handleUserChange = ([user]) => {
    if (!user) return;
    this.user = user;
    this.render();
  };

  render() {
    if (!this.user) return;
    const { subscriptions } = this.user;

    this.clearSubscriptions();

    this.subRoot.append(...subscriptions.map(this.createSubscriptionItem));
    this.root.hidden = false;
  }

  clearSubscriptions = () => {
    this.subRoot.querySelectorAll('*').forEach((n) => {
      n.remove();
    });
    this.root.hidden = true;
  };

  createSubscriptionItem = ({ firstName, lastName, id, avatar }) => {
    const element = this.subItemTemplate.content.cloneNode(true);

    const anchorTag = element.querySelector('a');
    const span = element.querySelector('span');
    const image = anchorTag.querySelector('img');

    const url = `/users/${id}`;
    anchorTag.href = url;
    anchorTag.addEventListener('click', nav);
    span.textContent = `${firstName} ${lastName}`;

    const isActive = url === window.location.pathname;

    if (isActive) {
      anchorTag.classList.add('active');
    }

    image.src = avatar;

    return element;
  };
}

customElements.define('subscription-list', Subscriptions);
