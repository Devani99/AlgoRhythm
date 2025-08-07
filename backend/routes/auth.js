import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'User exists' });
  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.status(201).json({ success: true, data: { user: user.getPublicProfile(), token } });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = generateToken(user._id);
  res.json({ success: true, data: { user: user.getPublicProfile(), token } });
}));

// Profile
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user.getPublicProfile() });
}));

export default router;