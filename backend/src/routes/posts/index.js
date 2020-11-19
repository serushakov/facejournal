import express from 'express';
import passport from 'passport';
import handleCreatePost, { createPostValidators } from './handleCreatePost';
import handleGetPost, { getPostValidators } from './handleGetPost';

const router = express.Router();

router.use(passport.authenticate('jwt'));

router.post('/', createPostValidators, handleCreatePost);
router.get('/:id', getPostValidators, handleGetPost);

export default router;
