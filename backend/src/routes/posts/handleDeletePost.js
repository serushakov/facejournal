import { param } from 'express-validator';
import { Post, User } from '../../database';

export const deletePostValidators = [param('id').exists().isUUID()];

const canDeletePost = async (post, user) => {
  if (post.creator.id === user.id) return true;

  const userPermissions = await (await user.getRole()).getPermissions();

  return userPermissions.some(
    (permission) => permission.name === 'post.delete'
  );
};

const handleDeletePost = async (req, res) => {
  const {
    user,
    params: { id },
  } = req;

  const post = await Post.findOne({
    where: { id },
    include: { model: User, as: 'creator' },
  });

  if (!post) {
    return res
      .status(400)
      .send([{ msg: 'Post with provided id could not be found' }]);
  }

  const canDelete = await canDeletePost(post, user);

  if (!canDelete) {
    return res
      .status(400)
      .send([{ msg: 'Cannot delet post: Insufficient permissions' }]);
  }

  await post.destroy();
  return res.sendStatus(200);
};

export default handleDeletePost;
