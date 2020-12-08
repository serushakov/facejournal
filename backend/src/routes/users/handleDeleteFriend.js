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

  await user.removeFriend(userId);

  return res.sendStatus(200);
};

export default handleDeleteFriend;
