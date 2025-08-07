# Create Auth Routes
auth_routes = """import express from 'express';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authLimiter, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, and password'
    });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password
  });

  // Generate token
  const token = generateToken(user._id);

  // Remove password from response
  const userResponse = user.getPublicProfile();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: userResponse,
      token
    }
  });
}));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // Find user by email
  const user = await User.findByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }

  // Validate password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken(user._id);

  // Remove password from response
  const userResponse = user.getPublicProfile();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      token
    }
  });
}));

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private (but handled in individual route)
router.get('/profile', asyncHandler(async (req, res) => {
  // Simple token verification without middleware for flexibility
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}));

// @desc    Refresh user token
// @route   POST /api/auth/refresh
// @access  Private (but handled in route)
router.post('/refresh', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}));

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Public
router.post('/logout', (req, res) => {
  // Since JWTs are stateless, logout is handled client-side by removing the token
  // This endpoint exists for consistency and potential future server-side session management
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Request password reset (placeholder for future implementation)
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const user = await User.findByEmail(email);
  if (!user) {
    // Don't reveal if user exists or not for security
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  }

  // TODO: Implement email sending logic
  // For now, just return success response
  res.json({
    success: true,
    message: 'Password reset functionality will be implemented soon'
  });
}));

// @desc    Verify email (placeholder for future implementation)
// @route   GET /api/auth/verify-email/:token
// @access  Public
router.get('/verify-email/:token', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Email verification functionality will be implemented soon'
  });
}));

export default router;
"""

with open("travel-backend/routes/auth.js", "w") as f:
    f.write(auth_routes)

print("Auth routes created successfully!")