import express from 'express';
import passport from 'passport';

import handleCreatePost, {
  createPostValidators,
  uploadHandler,
} from './handleCreatePost';
import handleGetFeed, { getFeedValidators } from './handleGetFeed';
import handleGetPost, { getPostValidators } from './handleGetPost';

const router = express.Router();

router.use(passport.authenticate('jwt'));

router.post('/', uploadHandler, handleCreatePost);
router.get('/post/:id', getPostValidators, handleGetPost);
router.get('/feed', getFeedValidators, handleGetFeed);

export default router;
