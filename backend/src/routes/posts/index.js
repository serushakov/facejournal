import express from 'express';
import passport from 'passport';

import handleCreatePost, { createPostValidators } from './handleCreatePost';
import handleGetFeed, { getFeedValidators } from './handleGetFeed';
import handleGetPost, { getPostValidators } from './handleGetPost';

const router = express.Router();

router.use(passport.authenticate('jwt'));

router.post('/', createPostValidators, handleCreatePost);
router.get('/post/:id', getPostValidators, handleGetPost);
router.get('/feed', getFeedValidators, handleGetFeed);

export default router;
