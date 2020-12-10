import { FETCH_CONFIG_REQUEST, FETCH_CONFIG_SUCCESS } from './types.js';

const initialState = {
  loading: false,
  error: null,
  content: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONFIG_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_CONFIG_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        content: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
