async function handleMe(req, res) {
  if (!req.isAuthenticated()) {
    res.status(401);
    return res.send([{ msg: 'Unauthorized' }]);
  }

  const subscriptions = (await req.user.getSubscriptions()).map((user) =>
    user.toSubscriptionJson()
  );

  res.send({
    ...(await req.user.toJSON()),
    followerCount: await req.user.countFollowers(),
    subscriptions,
  });
}

export default handleMe;
