import express from 'express';
import handleLogin, { loginValidators } from './handleLogin';
import handleRegister, {
  registerValidators,
  uploadHandler,
} from './handleRegister';
import handleValidate, { validateValidators } from './handleValidate';

const router = express.Router();

router.post('/login', loginValidators, handleLogin);
router.post('/register', uploadHandler, registerValidators, handleRegister);
router.post('/validate', validateValidators, handleValidate);

export default router;
