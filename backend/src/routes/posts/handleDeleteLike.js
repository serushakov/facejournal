import { param, validationResult } from 'express-validator';
import Like from '../../database/Like';

export const deleteLikeValidators = [param('id').exists().isUUID()];

const handleDeleteLike = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const {
    user,
    params: { id },
  } = req;

  const like = await Like.findOne({ where: { postId: id, userId: user.id } });

  if (!like) {
    return res.status(400).send([{ msg: 'Like could not be found' }]);
  }

  await like.destroy();

  return res.sendStatus(200);
};

export default handleDeleteLike;
