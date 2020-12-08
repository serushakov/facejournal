import express from 'express';
import passport from 'passport';
import handleMe from './handleMe';
import handleSearch, { searchValidators } from './handleSearch';
import handleGetUser, { getUserValidators } from './handleGetUser';
import { nonBlockingAuth } from '../../utils';
import handlePostFriend, { postFriendValidators } from './handlePostFriend';
import handleDeleteFriend, {
  deleteFriendValidators,
} from './handleDeleteFriend';
import handleGetFriends from './handleGetFriends';

const router = new express.Router();

router.get('/search', searchValidators, handleSearch);
router.get('/by_id/:id', nonBlockingAuth, getUserValidators, handleGetUser);

/* AUTHENTICATED ROUTES BELOW */
router.use(passport.authenticate('jwt'));

router.get('/me', handleMe);
router.post('/friend', postFriendValidators, handlePostFriend);
router.delete('/friend', deleteFriendValidators, handleDeleteFriend);
router.get('/friends', handleGetFriends);

export default router;
