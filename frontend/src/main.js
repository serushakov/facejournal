import Router from './router/Router.js';
import Route from './router/Route.js';
import store from '/state/index.js';
import { loadUser } from './state/auth/thunks.js';
import fetchConfig from './state/config/thunks.js';

// eslint-disable-next-line no-new
new Router(document.getElementById('root'), [
  new Route('/login', '/views/login/login.js', 'login-page'),
  new Route('/register', '/views/register/register.js', 'register-page'),
  new Route('/feed', '/views/feed/feed.js', 'feed-page'),
  new Route('/', '/views/front/front.js', 'front-page'),
  new Route('/search', '/views/search/search.js', 'search-page'),
  new Route('/users/:id', '/views/profile/profile.js', 'profile-page'),
  new Route(null, '/views/404/404.js', 'page-not-found'),
]);

store.dispatch(loadUser());
store.dispatch(fetchConfig());
