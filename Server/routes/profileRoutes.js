import express from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';
import { updateProfileRules, validate } from '../middleware/validators.js';

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfileRules, validate, updateProfile);

export default router;