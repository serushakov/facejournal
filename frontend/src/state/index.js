import Store from '/state/Store.js';
import auth from '/state/auth/reducer.js';
import feed from '/state/feed/reducer.js';

const store = new Store(
  Store.combineReducers({
    auth,
    feed,
  }),
  {}
);

export default store;
