import { FEED_SUCCESS, FEED_REQUEST } from './types.js';

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
