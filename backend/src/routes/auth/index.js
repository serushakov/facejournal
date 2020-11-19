import express from 'express';
import passport from 'passport';
import handleLogin, { loginValidators } from './handleLogin';
import handleRegister, { registerValidators } from './handleRegister';
import handleMe, { meValidators } from './handleMe.js';

const router = express.Router();

router.post('/login', loginValidators, handleLogin);
router.post('/register', registerValidators, handleRegister);

/* AUTHENTICATED ROUTES BELOW */
router.use(passport.authenticate('jwt'));

router.get('/me', meValidators, handleMe);

export default router;
