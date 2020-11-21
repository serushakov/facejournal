class Store {
  state = null;

  reducer = null;

  listeners = new Map(); // { [listener]: [ selector[] | null] }

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

  /* PUBLIC API */

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

  subscribeWithSelectors = (listener, ...selectors) => {
    const selectedStates = selectors.map((selector) => selector(this.state));

    this.listeners.set(listener, selectors);

    listener(...this.joinPrevAndCurrentStates(selectedStates));
  };

  subscribe = (listener) => {
    this.listeners.set(listener, null);

    listener(this.state);
  };

  unsubscribe = (listener) => {
    this.listeners.delete(listener);
  };

  /* PRIVATE API */

  sendUpdate(prevState) {
    for (const [listener, selectors] of this.listeners.entries()) {
      if (selectors === null) {
        listener(this.state, prevState);
      } else {
        const newStates = this.selectStatesWithSelector(selectors, this.state);
        const prevStates = this.selectStatesWithSelector(selectors, prevState);

        // Referrential comparision
        if (!this.statesAreEqual(newStates, prevStates)) {
          listener(...this.joinPrevAndCurrentStates(newStates, prevStates));
        }
      }
    }
  }

  statesAreEqual = (currentStates, prevStates) =>
    currentStates.reduce(
      (result, state, index) => result && state === prevStates[index],
      true
    );

  selectStatesWithSelector = (selectors, state) =>
    selectors.map((selector) => selector(state));

  joinPrevAndCurrentStates = (currentStates, nextStates) => {
    return currentStates.map((currentState, index) => [
      currentState,
      nextStates?.[index],
    ]);
  };
}

export default Store;
