import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { otpRateLimiter } from '../../middleware/rateLimiter';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', otpRateLimiter, authController.sendOtp);
router.post('/verify-otp', otpRateLimiter, authController.verifyOtp);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.getMe);

export default router;
