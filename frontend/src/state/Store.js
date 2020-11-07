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

    this.reducer(this.state, { type: null });
  }

  dispatch(action) {
    const newState = this.reducer(this.state, action);
    this.state = newState;

    this.sendUpdate();
  }

  sendUpdate() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  subscribe = (listener) => {
    this.listeners.add(listener);
  };

  unsubscribe = (listener) => {
    this.listeners.delete(listener);
  };
}

export default Store;
