export function selectRequestParams(state) {
  const { limit, offset } = state.feed;
  return {
    limit,
    offset,
  };
}
