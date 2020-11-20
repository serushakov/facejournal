import { FEED_REQUEST, FEED_SUCCESS } from './types.js';

const initialState = {
  loading: false,
  result: null,
  limit: 20,
  offset: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;

    case FEED_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FEED_SUCCESS:
      return {
        ...state,
        loading: false,
        result: action.payload,
      };
  }
};

export default reducer;
