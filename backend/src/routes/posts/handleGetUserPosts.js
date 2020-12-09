import { param, query, validationResult } from 'express-validator';
import { User } from '../../database';

export const getUserPostsValidators = [
  param('id').exists().isUUID(),
  query('limit').isNumeric().optional(),
  query('offset').isNumeric().optional(),
];

const handleGetUserPosts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const {
    params: { id },
    query: { limit, offset },
    user: currentUser,
  } = req;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  const posts = await user.getPosts({
    limit,
    offset,
  });

  console.log(currentUser);

  const formattedPosts = await Promise.all(
    posts.map((post) => post.toSimpleJSON(currentUser))
  );
  const count = await user.countPosts();

  return res.send({
    count,
    rows: formattedPosts,
  });
};

export default handleGetUserPosts;
