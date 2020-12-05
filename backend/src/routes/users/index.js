import express from 'express';
import passport from 'passport';
import handleMe from './handleMe';
import handleSearch, { searchValidators } from './handleSearch';

const router = new express.Router();

router.get('/search', searchValidators, handleSearch);

/* AUTHENTICATED ROUTES BELOW */
router.use(passport.authenticate('jwt'));

router.get('/me', handleMe);

export default router;
