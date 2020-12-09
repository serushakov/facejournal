const { body, validationResult } = require('express-validator');

export const deleteFriendValidators = [body('userId').isUUID().exists()];

const handleDeleteFriend = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const {
    user,
    body: { userId },
  } = req;

  const friend = (
    await user.getFriends({
      where: {
        id: userId,
      },
    })
  )[0];

  const isMutual = friend ? await friend.hasFriend(user.id) : false;

  if (isMutual) {
    friend.removeFriend(user.id);
  }

  await user.removeFriend(userId);

  return res.sendStatus(200);
};

export default handleDeleteFriend;
