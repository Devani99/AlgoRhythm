import express from 'express';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user statistics
  const tripStats = await Trip.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: null,
        totalTrips: { $sum: 1 },
        completedTrips: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        totalBudget: { $sum: '$budget.total' },
        averageBudget: { $avg: '$budget.total' }
      }
    }
  ]);

  const stats = tripStats[0] || {
    totalTrips: 0,
    completedTrips: 0,
    totalBudget: 0,
    averageBudget: 0
  };

  res.json({
    success: true,
    data: {
      user: user.getPublicProfile(),
      stats
    }
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', asyncHandler(async (req, res) => {
  const allowedFields = ['name', 'preferences'];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields provided for update'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user.getPublicProfile()
  });
}));

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  const user = await User.findById(req.user._id);

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required to delete account'
    });
  }

  const user = await User.findById(req.user._id);

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect password'
    });
  }

  // Delete user's trips
  await Trip.deleteMany({ user: req.user._id });

  // Delete user account
  await User.findByIdAndDelete(req.user._id);

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

// @desc    Get user's trip statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get comprehensive trip statistics
  const tripStats = await Trip.aggregate([
    { $match: { user: userId } },
    {
      $facet: {
        statusBreakdown: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 }
            }
          }
        ],
        destinationBreakdown: [
          {
            $group: {
              _id: '$destination.country',
              count: { $sum: 1 },
              cities: { $addToSet: '$destination.city' }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        monthlyStats: [
          {
            $group: {
              _id: { 
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              trips: { $sum: 1 },
              totalBudget: { $sum: '$budget.total' }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
          { $limit: 12 }
        ],
        budgetStats: [
          {
            $group: {
              _id: null,
              totalBudget: { $sum: '$budget.total' },
              averageBudget: { $avg: '$budget.total' },
              minBudget: { $min: '$budget.total' },
              maxBudget: { $max: '$budget.total' }
            }
          }
        ]
      }
    }
  ]);

  const stats = tripStats[0];

  res.json({
    success: true,
    data: {
      statusBreakdown: stats.statusBreakdown,
      destinationBreakdown: stats.destinationBreakdown,
      monthlyStats: stats.monthlyStats,
      budgetStats: stats.budgetStats[0] || {
        totalBudget: 0,
        averageBudget: 0,
        minBudget: 0,
        maxBudget: 0
      }
    }
  });
}));

export default router;
