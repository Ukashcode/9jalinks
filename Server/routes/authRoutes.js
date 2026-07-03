import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { registerRules, loginRules, validate } from '../middleware/validators.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', logout);

export default router;