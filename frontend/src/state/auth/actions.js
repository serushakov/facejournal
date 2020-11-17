import { LOGIN_SUCCESS, LOGIN_REQUEST } from "./types.js";

export function loginSuccess(user, token) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      user,
      token,
    },
  };
}

export function loginRequest() {
  return {
    type: LOGIN_REQUEST,
  };
}
