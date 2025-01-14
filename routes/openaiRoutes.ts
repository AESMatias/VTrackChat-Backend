import express from 'express';
import { queryOpenAI } from '../controllers/openaiController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/query', verifyToken, queryOpenAI);

export default router;