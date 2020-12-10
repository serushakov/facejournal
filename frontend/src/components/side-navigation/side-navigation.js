import css from './side-navigation.scss';
import { loadAndParseHtml } from '/loader.js';

class SideNavigation extends HTMLElement {
  constructor() {
    super();

    loadAndParseHtml('/components/side-navigation/side-navigation.html').then(
      this.mountRoot
    );
  }

  navigationItems = [
    {
      label: 'Feed',
      url: '/feed',
    },
    {
      label: 'Search',
      url: '/search',
    },
  ];

  mountRoot = (document) => {
    const template = document.getElementById('side-navigation');

    this.appendChild(template.content.cloneNode(true));

    this.navItemTemplate = this.querySelector('#navigation-item');
    this.navigationRoot = this.querySelector('#navigation-root');

    this.loadStyle();
    this.init();
  };

  loadStyle = () => {
    const style = document.createElement('style');
    style.textContent = css;

    this.appendChild(style);
  };

  init = () => {
    this.renderItems();
    window.addEventListener('popstate', this.handleLocationChange);
  };

  renderItems = () => {
    this.navigationItems.forEach(this.createNavigationItem);
  };

  handleLocationChange = () => {
    const currentRoute = window.location.pathname;

    if (this.navigationItems.some((item) => item.url === currentRoute)) {
      this.cleanup();
      this.renderItems();
    }
  };

  cleanup() {
    this.navigationRoot.querySelectorAll('*').forEach((n) => n.remove());
  }

  createNavigationItem = (navItem) => {
    const element = this.navItemTemplate.content.cloneNode(true);
    const container = element.querySelector('div');
    const anchorTag = element.querySelector('a');

    anchorTag.href = navItem.url;
    anchorTag.textContent = navItem.label;

    const isActive = navItem.url === window.location.pathname;

    if (isActive) {
      container.classList.add('active');
    }

    this.navigationRoot.appendChild(element);
  };
}

customElements.define('side-navigation', SideNavigation);
