import express from 'express';
import { queryOpenAI } from '../controllers/openaiController';
import { verifyToken } from '../middleware/authMiddleware';
import { limitMiddlewareAuthenticated } from '../middleware/rateLimiterAuthUsers';
import { requestQueueMiddleware } from '../middleware/requestQueueMiddleware';


const router = express.Router();

router.post('/query', verifyToken, limitMiddlewareAuthenticated, requestQueueMiddleware, queryOpenAI);

export default router;