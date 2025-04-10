import express from 'express';
import { login, signup, getProfile } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimit';

const router = express.Router();

// Public routes with rate limiting
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/me', isAuthenticated, getProfile);

export default router; 