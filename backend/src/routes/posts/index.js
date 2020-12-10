import express from 'express';
import passport from 'passport';

import handleCreatePost, {
  createPostValidators,
  uploadHandler,
} from './handleCreatePost';
import handleDeleteLike, { deleteLikeValidators } from './handleDeleteLike';
import handleGetFeed, { getFeedValidators } from './handleGetFeed';
import handleGetPost, { getPostValidators } from './handleGetPost';
import handleGetUserPosts, {
  getUserPostsValidators,
} from './handleGetUserPosts';
import handlePostLike, { postLikeValidators } from './handlePostLike';
import { nonBlockingAuth } from '../../utils';
import handleDeletePost, { deletePostValidators } from './handleDeletePost';

const router = express.Router();

router.get(
  '/user/:id',
  nonBlockingAuth,
  getUserPostsValidators,
  handleGetUserPosts
);

router.use(passport.authenticate('jwt'));

router.post('/post', uploadHandler, createPostValidators, handleCreatePost);
router.delete('/post/:id', deletePostValidators, handleDeletePost);
router.get('/post/:id', getPostValidators, handleGetPost);
router.get('/feed', getFeedValidators, handleGetFeed);
router.post('/post/:id/like', postLikeValidators, handlePostLike);
router.delete('/post/:id/like', deleteLikeValidators, handleDeleteLike);

export default router;
