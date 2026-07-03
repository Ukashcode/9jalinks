import bcrypt from 'bcrypt';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  markEmailVerified,
} from '../models/userModel.js';
import { issueOtp, verifyOtp as checkOtp, canIssueOtp } from '../services/otpService.js';

const SALT_ROUNDS = 10;

// POST /api/auth/register
// Creates the account as unverified and sends the first OTP.
// No JWT is issued yet — that only happens after verify-otp succeeds.
export const register = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return res.status(409).json({ success: false, message: 'Email is already registered' });
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    return res.status(409).json({ success: false, message: 'Username is already taken' });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ fullName, username, email, passwordHash });

  await issueOtp(user);

  res.status(201).json({
    success: true,
    message: 'Account created. Check your email for a verification code.',
    data: { email: user.email },
  });
});

// POST /api/auth/verify-otp
// Confirms the code, marks the account verified, and — only now — logs
// the user in by issuing a JWT.
export const verifyOtpHandler = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found for this email' });
  }

  if (user.email_verified) {
    return res.status(400).json({ success: false, message: 'This account is already verified' });
  }

  const result = await checkOtp(user.id, otp);
  if (!result.valid) {
    return res.status(400).json({ success: false, message: result.reason });
  }

  await markEmailVerified(user.id);
  const verifiedUser = await findUserById(user.id);
  const token = generateToken(user.id);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    data: { user: verifiedUser, token },
  });
});

// POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found for this email' });
  }

  if (user.email_verified) {
    return res.status(400).json({ success: false, message: 'This account is already verified' });
  }

  const check = await canIssueOtp(user.id);
  if (!check.allowed) {
    return res.status(429).json({
      success: false,
      message: check.reason,
      retryAfterSeconds: check.retryAfterSeconds,
    });
  }

  await issueOtp(user);

  res.status(200).json({ success: true, message: 'A new verification code has been sent' });
});

// POST /api/auth/login
// Blocks login until the email has been verified.
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.email_verified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email before logging in',
      data: { email: user.email, requiresVerification: true },
    });
  }

  const token = generateToken(user.id);
  delete user.password_hash;

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user, token },
  });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});