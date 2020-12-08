const { body } = require('express-validator');

export const deleteFriendValidators = [body('userId').isUUID().exists()];

const handleDeleteFriend = async (req, res) => {
  const {
    user,
    body: { userId },
  } = req;

  await user.removeFriend(userId);

  return res.sendStatus(200);
};

export default handleDeleteFriend;
