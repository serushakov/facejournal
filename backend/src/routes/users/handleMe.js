async function handleMe(req, res) {
  if (!req.isAuthenticated()) {
    res.status(401);
    return res.send([{ msg: 'Unauthorized' }]);
  }

  res.send(await req.user.toMeJson());
}

export default handleMe;
