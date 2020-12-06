import express from 'express';
import passport from 'passport';
import handleMe from './handleMe';
import handleSearch, { searchValidators } from './handleSearch';
import handleGetUser, { getUserValidators } from './handleGetUser';

const router = new express.Router();

router.get('/search', searchValidators, handleSearch);
router.get('/by_id/:id', getUserValidators, handleGetUser);

/* AUTHENTICATED ROUTES BELOW */
router.use(passport.authenticate('jwt'));

router.get('/me', handleMe);

export default router;
