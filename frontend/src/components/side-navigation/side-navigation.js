import store from '../../state/index.js';
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
    this.navigationItems.forEach(this.createNavigationItem);
  };

  createNavigationItem = (navItem) => {
    const element = this.navItemTemplate.content.cloneNode(true);

    const anchorTag = element.querySelector('a');

    anchorTag.href = navItem.url;
    anchorTag.textContent = navItem.label;

    this.navigationRoot.appendChild(element);
  };
}

customElements.define('side-navigation', SideNavigation);
