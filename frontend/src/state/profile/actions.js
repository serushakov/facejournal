import {
  FETCH_USER_POSTS_REQUEST,
  FETCH_USER_POSTS_SUCCESS,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
} from './types.js';

export const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST,
  };
};

export const fetchUserSuccess = (user) => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: user,
  };
};

export const fetchUserPostsRequest = () => {
  return {
    type: FETCH_USER_POSTS_REQUEST,
  };
};

export const fetchUserPostsSuccess = (posts) => {
  return {
    type: FETCH_USER_POSTS_SUCCESS,
    payload: posts,
  };
};
