import { fetchConfigRequest, fetchConfigSuccess } from './actions.js';

const fetchConfig = () => async (dispatch) => {
  dispatch(fetchConfigRequest());

  const request = await fetch('/api/config');
  const config = await request.json();

  dispatch(fetchConfigSuccess(config));
};

export default fetchConfig;
