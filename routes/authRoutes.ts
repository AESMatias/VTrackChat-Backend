import express from 'express';
import { register, login } from '../controllers/authController';
import { limitAuthRequests } from '../middleware/limitAuthRequests';
import { updateProfile } from '../controllers/setNewSettings';
import { verifyToken } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/register', limitAuthRequests, register);
router.post('/login', limitAuthRequests, login);
router.post('/update-profile', limitAuthRequests, updateProfile, updateProfile);

export default router;