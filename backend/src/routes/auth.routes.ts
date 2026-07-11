import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as authVal from '../validators/auth.validator';
import rateLimit from 'express-rate-limit';

const router = Router();
const authController = new AuthController();

// Strict limiter for sensitive auth routes to prevent brute force
const strictLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: 'Too many attempts from this IP, please try again after 15 minutes.' 
});

const standardLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 50 
});

router.post('/register', strictLimiter, validate(authVal.registerSchema), authController.register);
router.post('/login', strictLimiter, validate(authVal.loginSchema), authController.login);
router.post('/verify-email', strictLimiter, validate(authVal.verifyEmailSchema), authController.verifyEmail);
router.post('/forgot-password', strictLimiter, validate(authVal.forgotPasswordSchema), authController.forgotPassword);
router.post('/verify-reset-otp', strictLimiter, validate(authVal.verifyEmailSchema), authController.verifyResetOtp);
router.post('/reset-password', strictLimiter, validate(authVal.resetPasswordSchema), authController.resetPassword);
router.post('/refresh-token', standardLimiter, authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);
router.post('/logout-all', requireAuth, authController.logoutAll);
router.post('/google', strictLimiter, authController.googleLogin);

export default router;
