import { Router } from 'express';
import { register, login, refreshToken, logout, forgotPassword, resetPassword, verifyEmail, resendVerification } from '../controllers/authController.js';
import validateRequest from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, resendVerificationSchema } from '../validators/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validateRequest(resetPasswordSchema), resetPassword);
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', validateRequest(resendVerificationSchema), resendVerification);

export default router;
