import express from 'express';
import { register, login } from '../controllers/authController';
import { limitAuthRequests } from '../middleware/limitAuthRequests';


const router = express.Router();

router.post('/register', limitAuthRequests, register);
router.post('/login', limitAuthRequests, login);

export default router;