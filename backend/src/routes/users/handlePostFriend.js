import { param } from 'express-validator';
import { User } from '../../database';

export const postFriendValidators = [param('userId').isUUID().exists()];

const handlePostFriend = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;

  const friend = await User.findOne({
    where: {
      id,
    },
  });

  if (!friend) {
    return req.status(400).send([
      {
        msg: 'No user found with this id',
      },
    ]);
  }

  await user.addSubscription(id);

  return res.sendStatus(201);
};

export default handlePostFriend;
