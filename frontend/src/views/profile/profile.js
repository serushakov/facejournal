import { loadAndParseHtml } from '/loader.js';
import '/components/post-item/post-item.js';

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
    this.postsRoot = this.querySelector('#posts-root');

    const user = await this.fetchUser();
    await this.fetchPosts();
    if (user) {
      this.renderUser();
      this.renderPosts();
    }
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

  async fetchPosts() {
    if (!this.routeParams) return;
    const { id } = this.routeParams;

    const postsResponse = await fetch(`/api/posts/user/${id}`);
    const posts = await postsResponse.json();

    this.posts = posts;
  }

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
    const { title, textContent, media } = post;

    const postItemContainer = document.createElement('div');
    postItemContainer.classList.add('feed-page__item');

    const postItem = document.createElement('post-item');

    const titleSlot = document.createElement('span');
    titleSlot.textContent = title;
    titleSlot.slot = 'title';

    const textContentSlot = document.createElement('p');
    textContentSlot.textContent = textContent;
    textContentSlot.slot = 'text-content';

    if (media.length) {
      postItem.setMedia(media);
    }

    postItem.append(titleSlot, textContentSlot);
    postItemContainer.appendChild(postItem);

    return postItemContainer;
  };

  clearPosts() {
    this.postsRoot.querySelectorAll('*').forEach((n) => n.remove());
  }

  renderPosts() {
    const { count, rows } = this.posts;

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
