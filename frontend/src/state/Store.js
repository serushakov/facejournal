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

  dispatch(action) {
    const newState = this.reducer(this.state, action);
    const prevState = this.state;
    this.state = newState;

    console.log(this.state);

    this.sendUpdate(prevState);
  }

  sendUpdate(prevState) {
    for (const listener of this.listeners) {
      listener(this.state, prevState);
    }
  }

  subscribe = (listener) => {
    this.listeners.add(listener);
    console.log(this.state);
    listener(this.state);
  };

  unsubscribe = (listener) => {
    this.listeners.delete(listener);
  };
}

export default Store;
