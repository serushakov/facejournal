import { selectToken } from '../auth/selectors.js';
import {
  fetchUserSuccess,
  fetchUserRequest,
  fetchUserPostsSuccess,
  fetchUserPostsRequest,
} from './actions.js';

export const fetchUser = (id) => async (dispatch, getState) => {
  const token = selectToken(getState());

  dispatch(fetchUserRequest());

  const response = await fetch(`/api/users/by_id/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const user = await response.json();

  dispatch(fetchUserSuccess(user));
};

export const fetchUserPosts = (id) => async (dispatch, getState) => {
  const token = selectToken(getState());

  dispatch(fetchUserPostsRequest());

  const response = await fetch(`/api/posts/user/${id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });

  const posts = await response.json();

  dispatch(fetchUserPostsSuccess(posts));
};
