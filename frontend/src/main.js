import Router from './router/Router.js';
import Route from './router/Route.js';
import store from '/state/index.js';
import { loginSuccess, loginRequest } from '/state/auth/actions.js';
import { loginFailure } from './state/auth/actions.js';

// eslint-disable-next-line no-unused-vars
const router = new Router(document.getElementById('root'), [
  new Route('/login', '/views/login/login.js', 'login-page'),
  new Route('/register', '/views/register/register.js', 'register-page'),
  new Route('/feed', '/views/feed/feed.js', 'feed-page'),
  new Route('/', '/views/front/front.js', 'front-page'),
  new Route('/search', '/views/search/search.js', 'search-page'),
  new Route(null, '/views/404/404.js', 'page-not-found'),
]);

async function loadUser() {
  const token = localStorage.getItem('token');

  if (token) {
    store.dispatch(loginRequest());

    const response = await fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await response.json();

    store.dispatch(loginSuccess(user, token));
  } else {
    store.dispatch(loginFailure());
  }
}

loadUser();
