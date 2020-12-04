import {
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGOUT_SUCCESS,
  LOGIN_FAILURE,
} from './types.js';

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

export function loginFailure() {
  return {
    type: LOGIN_FAILURE,
  };
}

export function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS,
  };
}
