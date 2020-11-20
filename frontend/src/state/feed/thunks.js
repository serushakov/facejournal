import { selectToken } from '../auth/selectors.js';
import { getFeedRequest, getFeedSuccess } from './actions.js';

export const getFeed = ({ limit, offset }) => async (dispatch, getState) => {
  const token = selectToken(getState());

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
