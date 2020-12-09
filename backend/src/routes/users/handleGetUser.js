import { param, validationResult } from 'express-validator';
import { User } from '../../database';

export const getUserValidators = [param('id').exists().isUUID()];

const hanldeGetUser = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    return res.status(404).send([
      {
        msg: 'User not found',
      },
    ]);
  }

  res.send({
    ...(await user.toJSON()),
    subscribed: await user.hasFollower(req.user),
    isFollowing: await user.hasSubscription(req.user),
  });
};

export default hanldeGetUser;
