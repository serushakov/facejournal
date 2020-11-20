class Store {
  state = null;

  reducer = null;

  listeners = new Map(); // { [listener]: [ selector | null] }

  static combineReducers(reducers) {
    return (state, action) => {
      const newState = {};
      for (const [branch, reducer] of Object.entries(reducers)) {
        newState[branch] = reducer(state[branch], action);
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
    if (typeof action === 'function') {
      return action(this.dispatch, this.getState);
    }

    const newState = this.reducer(this.state, action);
    const prevState = this.state;
    this.state = newState;

    this.sendUpdate(prevState);
  };

  sendUpdate(prevState) {
    for (const [listener, selector] of this.listeners.entries()) {
      if (selector === null) {
        listener(this.state, prevState);
      } else {
        const newState = selector(this.state);
        const selectorPrevState = selector(prevState);

        // Referrential comparision
        if (newState !== selectorPrevState) {
          listener(newState);
        }
      }
    }
  }

  subscribeWithSelector = (selector, listener) => {
    const selectedState = selector(this.state);
    this.listeners.set(listener, selector);

    listener(selectedState, null);
  };

  subscribe = (listener) => {
    this.listeners.set(listener, null);

    listener(this.state);
  };

  unsubscribe = (listener) => {
    this.listeners.delete(listener);
  };
}

export default Store;
