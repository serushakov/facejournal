const { param, validationResult } = require('express-validator');

export const deleteFriendValidators = [param('id').isUUID().exists()];

const handleDeleteFriend = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const {
    user,
    params: { id },
  } = req;

  await user.removeSubscription(id);

  return res.sendStatus(200);
};

export default handleDeleteFriend;
