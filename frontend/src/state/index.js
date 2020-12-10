import Store from './Store.js';
import auth from './auth/reducer.js';
import feed from './feed/reducer.js';
import profile from './profile/reducer.js';
import config from './config/reducer.js';

const store = new Store(
  Store.combineReducers({
    auth,
    feed,
    profile,
    config,
  }),
  {}
);

export default store;
