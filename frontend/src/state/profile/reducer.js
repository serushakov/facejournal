import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_POSTS_REQUEST,
  FETCH_USER_POSTS_SUCCESS,
} from './types.js';

const initialState = {
  loading: false,
  error: null,
  user: null,
  posts: {
    loading: false,
    error: null,
    content: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return {
        ...state,
        ...initialState,
        loading: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
      };
    case FETCH_USER_POSTS_REQUEST:
      return {
        ...state,
        posts: {
          ...state.posts,
          loading: true,
        },
      };
    case FETCH_USER_POSTS_SUCCESS:
      return {
        ...state,
        posts: {
          loading: false,
          error: null,
          content: action.payload,
        },
      };
    default:
      return state;
  }
};

export default reducer;
