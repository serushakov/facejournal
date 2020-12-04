import express from 'express';
import passport from 'passport';
import handleLogin, { loginValidators } from './handleLogin';
import handleRegister, { registerValidators } from './handleRegister';

const router = express.Router();

router.post('/login', loginValidators, handleLogin);
router.post('/register', registerValidators, handleRegister);

/* AUTHENTICATED ROUTES BELOW */
router.use(passport.authenticate('jwt'));

export default router;
