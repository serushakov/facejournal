import express from 'express';
import passport from 'passport';

import handleCreatePost, {
  createPostValidators,
  uploadHandler,
} from './handleCreatePost';
import handleGetFeed, { getFeedValidators } from './handleGetFeed';
import handleGetPost, { getPostValidators } from './handleGetPost';
import handleGetUserPosts, {
  getUserPostsValidators,
} from './handleGetUserPosts';
import { postLikeValidators } from './handlePostLike';

const router = express.Router();

router.get('/user/:id', getUserPostsValidators, handleGetUserPosts);

router.use(passport.authenticate('jwt'));

router.post('/', uploadHandler, createPostValidators, handleCreatePost);
router.get('/post/:id', getPostValidators, handleGetPost);
router.get('/feed', getFeedValidators, handleGetFeed);
router.post('/post/:id/like', postLikeValidators);

export default router;
