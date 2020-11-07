const initialState = {
  login: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;

    case "auth/SET_LOGIN":
      return {
        ...state,
        login: action.payload,
      };
  }
};

export default reducer;
