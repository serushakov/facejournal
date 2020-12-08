import { body, validationResult } from 'express-validator';
import { Post } from '../../database';

export const postLikeValidators = [body('postId').exists().isUUID()];

const handlePostLike = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const {
    user,
    body: { postId },
  } = req;

  const post = await Post.findOne({ where: { id: postId } });

  if (!post) {
    return res.status(400).send([{ msg: 'Post with that id was not found' }]);
  }

  await post.createLike({
    userId: user.id,
  });

  return res.sendStatus(201);
};

export default handlePostLike;
