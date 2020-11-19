import express from 'express';
import passport from 'passport';
import { Op } from 'sequelize';
import { body, param, validationResult } from 'express-validator';
import { Post, User } from '../../database';

const router = express.Router();

router.use(passport.authenticate('jwt'));

const createPostValidators = [
  body('title').exists().isLength({ min: 3, max: 200 }),
  body('text_content').isLength({ max: 3000 }),
];

router.post('/', createPostValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }
  const { user, body: requestBody } = req;
  const { title, text_content: textContent } = requestBody;

  if (!user) {
    return res.status(500);
  }

  const post = await Post.create({
    title,
    textContent,
    creator: user.id,
  });

  res.status(201);

  res.send(post);
});

const getPostValidators = [param('id').exists()];

router.get('/:id', async (req, res) => {
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
});

export default router;
