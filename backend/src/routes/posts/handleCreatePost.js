import { body, validationResult } from 'express-validator';
import { Post } from '../../database';

export const createPostValidators = [
  body('title').exists().isLength({ min: 3, max: 200 }),
  body('text_content').isLength({ max: 3000 }),
];

async function handleCreatePost(req, res) {
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
}

export default handleCreatePost;
