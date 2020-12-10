import express from 'express';
import handleGetConfig from './handleGetConfig';

const router = express.Router();

router.get('/', handleGetConfig);

export default router;
