const handleGetFriends = async (req, res) => {
  const friends = await req.user.getFriends();

  const formattedFriends = await Promise.all(
    friends.map((friend) => friend.toJsonWithFriendship(req.user))
  );

  return res.send(formattedFriends);
};

export default handleGetFriends;
