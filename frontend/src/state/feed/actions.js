import { FEED_SUCCESS, FEED_REQUEST, SET_FEED_PARAMS } from './types.js';

export function getFeedSuccess(result) {
  return {
    type: FEED_SUCCESS,
    payload: result,
  };
}

export function getFeedRequest() {
  return {
    type: FEED_REQUEST,
  };
}

export function setFeedParams(params) {
  return {
    type: SET_FEED_PARAMS,
    payload: params,
  };
}
