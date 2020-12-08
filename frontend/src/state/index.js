import Store from './Store.js';
import auth from './auth/reducer.js';
import feed from './feed/reducer.js';
import profile from './profile/reducer.js';

const store = new Store(
  Store.combineReducers({
    auth,
    feed,
    profile,
  }),
  {}
);

export default store;
