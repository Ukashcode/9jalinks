import bcrypt from 'bcrypt';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import { createUser, findUserByEmail, findUserByUsername } from '../models/userModel.js';

const SALT_ROUNDS = 10;

// POST /api/auth/register
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
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: { user, token },
  });
});

// POST /api/auth/login
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

  const token = generateToken(user.id);

  // Strip the hash before sending the user object back to the client.
  delete user.password_hash;

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: { user, token },
  });
});

// POST /api/auth/logout
// JWTs are stateless, so there's nothing to invalidate server-side in
// Sprint 1 — this endpoint exists mainly for a consistent client-side
// contract (and as a place to add token blacklisting later if needed).
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});