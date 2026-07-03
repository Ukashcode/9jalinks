import asyncHandler from '../utils/asyncHandler.js';
import { updateUserProfile } from '../models/userModel.js';

// GET /api/profile/me
// req.user is already populated by the `protect` middleware, so this
// just returns it — no extra DB call needed.
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user } });
});

// PUT /api/profile/me
export const updateProfile = asyncHandler(async (req, res) => {
  const { full_name, username, bio, profile_image } = req.body;

  const updatedUser = await updateUserProfile(req.user.id, {
    full_name,
    username,
    bio,
    profile_image,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser },
  });
});