import { loginSuccess, logoutSuccess } from "./actions.js";

const LOCALSTORAGE_TOKEN = "token";

export const logout = () => (dispatch) => {
  localStorage.removeItem(LOCALSTORAGE_TOKEN);
  dispatch(logoutSuccess());
};

export const login = (email, password) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
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

export const register = ({ firstName, lastName, email, password }) => async (
  dispatch
) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    }),
  });

  const { user, token } = await response.json();

  dispatch(loginSuccess(user, token));
  localStorage.setItem(LOCALSTORAGE_TOKEN, token);
};
