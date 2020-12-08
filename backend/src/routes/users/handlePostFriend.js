import { body } from 'express-validator';
import { User } from '../../database';

export const postFriendValidators = [body('userId').isUUID().exists()];

const handlePostFriend = async (req, res) => {
  const {
    user,
    body: { userId },
  } = req;

  const friend = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!friend) {
    return req.status(400).send([
      {
        msg: 'No user found with this id',
      },
    ]);
  }

  const friendship = await user.addFriend(userId);

  return res.status(201).send(friendship);
};

export default handlePostFriend;
