import {
  FETCH_CONFIG_FAILURE,
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_SUCCESS,
} from './types.js';

export const fetchConfigRequest = () => ({
  type: FETCH_CONFIG_REQUEST,
});

export const fetchConfigSuccess = (config) => ({
  type: FETCH_CONFIG_SUCCESS,
  payload: config,
});

export const fetchConfigFailure = () => ({
  type: FETCH_CONFIG_FAILURE,
});
