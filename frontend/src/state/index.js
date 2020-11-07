import Store from "/state/Store.js";
import auth from "/state/auth/reducer.js";

const store = new Store(
  Store.combineReducers({
    auth,
  }),
  {}
);

export default store;
