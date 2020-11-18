class Store {
  state = null;
  reducer = null;

  listeners = new Set();

  static combineReducers(reducers) {
    return (state, action) => {
      const newState = {};
      for (const branch in reducers) {
        newState[branch] = reducers[branch](state[branch], action);
      }

      return newState;
    };
  }

  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state = initialState;

    this.state = this.reducer(this.state, { type: null });
  }

  getState = () => this.state;

  dispatch = (action) => {
    // Redux-thunk pattern
    if (typeof action === "function") {
      return action(this.dispatch, this.getState);
    } else {
      const newState = this.reducer(this.state, action);
      const prevState = this.state;
      this.state = newState;

      this.sendUpdate(prevState);
    }
  };

  sendUpdate(prevState) {
    for (const listener of this.listeners) {
      listener(this.state, prevState);
    }
  }

  subscribe = (listener) => {
    this.listeners.add(listener);

    listener(this.state);
  };

  unsubscribe = (listener) => {
    this.listeners.delete(listener);
  };
}

export default Store;
