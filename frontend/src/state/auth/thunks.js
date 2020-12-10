import {
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutSuccess,
} from './actions.js';

const LOCALSTORAGE_TOKEN = 'token';

export const logout = () => (dispatch) => {
  localStorage.removeItem(LOCALSTORAGE_TOKEN);
  dispatch(logoutSuccess());
};

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

export const register = (formData) => async (dispatch) => {
  const request = new XMLHttpRequest();

  request.open('POST', '/api/auth/register');

  request.addEventListener('load', () => {
    const { user, token } = JSON.parse(request.responseText);
    dispatch(loginSuccess(user, token));
    localStorage.setItem(LOCALSTORAGE_TOKEN, token);
  });

  request.send(formData);
};

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem('token');

  if (token) {
    dispatch(loginRequest());

    const response = await fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await response.json();

    dispatch(loginSuccess(user, token));
  } else {
    dispatch(loginFailure());
  }
};
