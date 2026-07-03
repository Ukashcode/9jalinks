import express from 'express';
import { register, login, logout, verifyOtpHandler, resendOtp } from '../controllers/authController.js';
import {
  registerRules,
  loginRules,
  verifyOtpRules,
  resendOtpRules,
  validate,
} from '../middleware/validators.js';
import { resendOtpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', logout);
router.post('/verify-otp', verifyOtpRules, validate, verifyOtpHandler);
router.post('/resend-otp', resendOtpLimiter, resendOtpRules, validate, resendOtp);

export default router;