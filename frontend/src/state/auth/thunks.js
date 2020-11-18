import { loginSuccess, logoutSuccess } from "./actions.js";

const LOCALSTORAGE_TOKEN = "token";

export const logout = () => (dispatch) => {
  localStorage.removeItem(LOCALSTORAGE_TOKEN);
  dispatch(logoutSuccess());
};

export const login = (email, password) => async (dispatch) => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const { user, token } = await response.json();

  dispatch(loginSuccess(user, token));
  localStorage.setItem(LOCALSTORAGE_TOKEN, token);
};
