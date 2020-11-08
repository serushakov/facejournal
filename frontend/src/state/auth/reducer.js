import { LOGIN_SUCCESS } from "/state/auth/types.js";

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

    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
  }
};

export default reducer;
