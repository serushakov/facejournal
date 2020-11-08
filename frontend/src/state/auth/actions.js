import { LOGIN_SUCCESS } from "/state/auth/types.js";

export function loginSuccess(user, token) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      user,
      token,
    },
  };
}
