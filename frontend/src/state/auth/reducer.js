import { LOGIN_REQUEST, LOGIN_SUCCESS } from "./types.js";

const initialState = {
  user: null,
  token: null,
  loading: false,
  initialized: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;

    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        initialized: true,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
      };
  }
};

export default reducer;
