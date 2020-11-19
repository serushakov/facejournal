import { param, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { User, Post } from '../../database';

export const getPostValidators = [param('id').exists()];

async function handleGetPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      id: {
        [Op.eq]: id,
      },
    },
    include: {
      model: User,
      attributes: ['firstName', 'lastName', 'id', 'email'],
    },
  });

  if (!post) {
    return res.status(400).send([{ message: 'Post not found' }]);
  }

  res.send(post);
}

export default handleGetPost;
