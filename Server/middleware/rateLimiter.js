import rateLimit from 'express-rate-limit';

// This is a coarse, IP-based safety net on top of the finer, per-user
// rate limiting already enforced in services/otpService.js (cooldown +
// rolling window). This one stops a single IP from hammering the endpoint
// across many different email addresses.
export const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP per window, across all emails
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this device. Please try again later.',
  },
});