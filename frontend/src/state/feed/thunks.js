import { selectToken } from '../auth/selectors.js';
import { getFeedRequest, getFeedSuccess } from './actions.js';
import { selectRequestParams } from './selectors.js';

export const getFeed = () => async (dispatch, getState) => {
  const token = selectToken(getState());

  const { limit, offset } = selectRequestParams(getState());

  dispatch(getFeedRequest());

  const query = new URLSearchParams();
  query.set('limit', limit);
  query.set('offset', offset);

  const request = await fetch(`/api/posts/feed?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await request.json();

  dispatch(getFeedSuccess(result));
};
