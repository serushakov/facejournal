import { loadAndParseHtml } from '/loader.js';

import css from './profile.scss';

class ProfilePage extends HTMLElement {
  constructor() {
    super();
    loadAndParseHtml('/views/profile/profile.html').then(this.setContent);
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
    const user = await this.fetchUser();
    if (user) this.displayUser();
  }

  set params(value) {
    this.routeParams = value;

    this.init();
  }

  async fetchUser() {
    if (!this.routeParams) return;
    const { id } = this.routeParams;

    const response = await fetch(`/api/users/by_id/${id}`);

    const user = await response.json();

    this.user = user;
    return user;
  }

  displayUser() {
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
}

customElements.define('profile-page', ProfilePage);
