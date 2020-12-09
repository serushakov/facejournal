async function handleMe(req, res) {
  if (!req.isAuthenticated()) {
    res.status(401);
    return res.send([{ msg: 'Unauthorized' }]);
  }

  res.send({
    ...(await req.user.toJSON()),
    followerCount: await req.user.countFollowers(),
    subscriptionsCount: await req.user.countSubscriptions(),
  });
}

export default handleMe;
