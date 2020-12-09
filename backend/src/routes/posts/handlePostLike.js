import { param, validationResult } from 'express-validator';
import { Post } from '../../database';

export const postLikeValidators = [param('id').exists().isUUID()];

const isNonUniqueError = (error) => {
  const firstError = error.errors && error.errors[0];
  return !!firstError && firstError.type === 'unique violation';
};

const handlePostLike = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const {
    user,
    params: { id },
  } = req;

  const post = await Post.findOne({ where: { id } });

  if (!post) {
    return res.status(400).send([{ msg: 'Post with that id was not found' }]);
  }

  try {
    await post.createLike({
      userId: user.id,
    });
  } catch (error) {
    res.status(400).send([
      {
        msg: isNonUniqueError(error)
          ? 'Post already liked by this user'
          : error.message,
      },
    ]);
  }

  return res.sendStatus(201);
};

export default handlePostLike;
