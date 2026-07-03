import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import {
  createOtp,
  findActiveOtpByUserId,
  incrementOtpAttempts,
  markOtpConsumed,
  invalidateActiveOtps,
  countRecentOtps,
  getLastOtpSentAt,
} from '../models/otpModel.js';
import { sendOtpEmail } from './emailService.js';

dotenv.config();

const OTP_SALT_ROUNDS = 10;
const MAX_VERIFY_ATTEMPTS = 5;

const EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 5);
const RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);
const MAX_RESENDS_PER_WINDOW = Number(process.env.OTP_MAX_RESENDS_PER_WINDOW || 3);
const RESEND_WINDOW_MINUTES = Number(process.env.OTP_RESEND_WINDOW_MINUTES || 15);

const generateSixDigitOtp = () => {
  // Zero-padded so we always get exactly 6 digits, e.g. "004821".
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
};

// Generates a code, hashes it (never stored or logged in plain text),
// invalidates any previous active code, saves the new one, and emails it.
export const issueOtp = async (user) => {
  const otp = generateSixDigitOtp();
  const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await invalidateActiveOtps(user.id);
  await createOtp({ userId: user.id, otpHash, expiresAt });
  await sendOtpEmail({ to: user.email, fullName: user.full_name, otp });
};

// Checks a submitted code against the active OTP for this user.
// Returns { valid: boolean, reason?: string }.
export const verifyOtp = async (userId, submittedOtp) => {
  const activeOtp = await findActiveOtpByUserId(userId);

  if (!activeOtp) {
    return { valid: false, reason: 'Code has expired or was not found. Request a new one.' };
  }

  if (activeOtp.attempts >= MAX_VERIFY_ATTEMPTS) {
    return { valid: false, reason: 'Too many incorrect attempts. Request a new code.' };
  }

  const isMatch = await bcrypt.compare(submittedOtp, activeOtp.otp_hash);

  if (!isMatch) {
    await incrementOtpAttempts(activeOtp.id);
    return { valid: false, reason: 'Incorrect code. Please try again.' };
  }

  await markOtpConsumed(activeOtp.id);
  return { valid: true };
};

// Enforces two layers of rate limiting for resends:
// 1. A short cooldown between any two consecutive sends (stops double-clicks/spam)
// 2. A cap on total sends within a rolling window (stops abuse over time)
// Returns { allowed: boolean, reason?: string, retryAfterSeconds?: number }.
export const canIssueOtp = async (userId) => {
  const lastSentAt = await getLastOtpSentAt(userId);

  if (lastSentAt) {
    const secondsSinceLastSend = (Date.now() - new Date(lastSentAt).getTime()) / 1000;
    if (secondsSinceLastSend < RESEND_COOLDOWN_SECONDS) {
      return {
        allowed: false,
        reason: 'Please wait before requesting another code.',
        retryAfterSeconds: Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLastSend),
      };
    }
  }

  const recentCount = await countRecentOtps(userId, RESEND_WINDOW_MINUTES);
  if (recentCount >= MAX_RESENDS_PER_WINDOW) {
    return {
      allowed: false,
      reason: `Too many requests. Please try again in ${RESEND_WINDOW_MINUTES} minutes.`,
    };
  }

  return { allowed: true };
};