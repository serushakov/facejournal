import express from 'express';
import passport from 'passport';
import handleMe, { meValidators } from './handleMe';

const router = new express.Router();

/* AUTHENTICATED ROUTES BELOW */
router.use(passport.authenticate('jwt'));

router.get('/me', meValidators, handleMe);

export default router;
