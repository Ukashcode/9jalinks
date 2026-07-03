import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { findUserById } from '../models/userModel.js';

// Protects a route: expects "Authorization: Bearer <token>".
// On success, attaches the authenticated user to req.user so downstream
// controllers can use it without re-querying or re-verifying anything.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token' });
  }
});

export default protect;