import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_SUCCESS } from "./types.js";

const resetState = {
  user: null,
  token: null,
};

const initialState = {
  ...resetState,
  loading: false,
  initialized: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;

    case LOGOUT_SUCCESS:
      return {
        ...state,
        ...resetState,
      };

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
