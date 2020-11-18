import { LOGIN_SUCCESS, LOGIN_REQUEST, LOGOUT_SUCCESS } from "./types.js";

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

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}
