# Create remaining route files
users_routes = """import express from 'express';
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
"""

with open("travel-backend/routes/users.js", "w") as f:
    f.write(users_routes)

# Create Itinerary routes
itinerary_routes = """import express from 'express';
import Trip from '../models/Trip.js';
import aiService from '../services/aiService.js';
import placesService from '../services/placesService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Add activity to a specific day
// @route   POST /api/itinerary/:tripId/days/:dayNumber/activities
// @access  Private
router.post('/:tripId/days/:dayNumber/activities', asyncHandler(async (req, res) => {
  const { tripId, dayNumber } = req.params;
  const activityData = req.body;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  const dayIndex = parseInt(dayNumber) - 1;
  if (dayIndex < 0 || dayIndex >= trip.itinerary.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid day number'
    });
  }

  // Validate required activity fields
  if (!activityData.name) {
    return res.status(400).json({
      success: false,
      message: 'Activity name is required'
    });
  }

  const newActivity = {
    name: activityData.name,
    description: activityData.description || '',
    category: activityData.category || 'other',
    location: activityData.location || {},
    duration: activityData.duration || { hours: 1, minutes: 0 },
    estimatedCost: activityData.estimatedCost || { min: 0, max: 0, currency: 'USD' },
    timeSlot: activityData.timeSlot || { startTime: '09:00', endTime: '10:00' },
    priority: activityData.priority || 'medium',
    bookingInfo: activityData.bookingInfo || { isBookingRequired: false },
    notes: activityData.notes || '',
    completed: false
  };

  trip.itinerary[dayIndex].activities.push(newActivity);
  await trip.save();

  res.status(201).json({
    success: true,
    message: 'Activity added successfully',
    data: newActivity
  });
}));

// @desc    Update activity in a specific day
// @route   PUT /api/itinerary/:tripId/days/:dayNumber/activities/:activityId
// @access  Private
router.put('/:tripId/days/:dayNumber/activities/:activityId', asyncHandler(async (req, res) => {
  const { tripId, dayNumber, activityId } = req.params;
  const updates = req.body;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  const dayIndex = parseInt(dayNumber) - 1;
  if (dayIndex < 0 || dayIndex >= trip.itinerary.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid day number'
    });
  }

  const activity = trip.itinerary[dayIndex].activities.id(activityId);
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }

  // Update allowed fields
  const allowedFields = [
    'name', 'description', 'category', 'location', 'duration',
    'estimatedCost', 'timeSlot', 'priority', 'bookingInfo', 'notes', 'completed'
  ];

  allowedFields.forEach(field => {
    if (updates[field] !== undefined) {
      activity[field] = updates[field];
    }
  });

  await trip.save();

  res.json({
    success: true,
    message: 'Activity updated successfully',
    data: activity
  });
}));

// @desc    Delete activity from a specific day
// @route   DELETE /api/itinerary/:tripId/days/:dayNumber/activities/:activityId
// @access  Private
router.delete('/:tripId/days/:dayNumber/activities/:activityId', asyncHandler(async (req, res) => {
  const { tripId, dayNumber, activityId } = req.params;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  const dayIndex = parseInt(dayNumber) - 1;
  if (dayIndex < 0 || dayIndex >= trip.itinerary.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid day number'
    });
  }

  const activity = trip.itinerary[dayIndex].activities.id(activityId);
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }

  trip.itinerary[dayIndex].activities.pull(activityId);
  await trip.save();

  res.json({
    success: true,
    message: 'Activity deleted successfully'
  });
}));

// @desc    Get AI-generated activity suggestions
// @route   GET /api/itinerary/:tripId/suggestions
// @access  Private
router.get('/:tripId/suggestions', asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const { day } = req.query;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  try {
    // Get existing activities to avoid duplicates
    let existingActivities = [];
    if (day) {
      const dayIndex = parseInt(day) - 1;
      if (dayIndex >= 0 && dayIndex < trip.itinerary.length) {
        existingActivities = trip.itinerary[dayIndex].activities;
      }
    } else {
      // Get all activities from all days
      existingActivities = trip.itinerary.reduce((acc, dayPlan) => {
        return acc.concat(dayPlan.activities);
      }, []);
    }

    const suggestions = await aiService.generateActivitySuggestions(
      trip.destination,
      trip.preferences,
      existingActivities
    );

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    // Fallback to Places API if AI fails
    try {
      const places = await placesService.getPopularAttractions(
        trip.destination.city,
        trip.destination.country,
        10
      );

      const suggestions = places.map(place => ({
        name: place.name,
        description: `Popular attraction in ${trip.destination.city}`,
        category: 'sightseeing',
        estimatedDuration: '2 hours',
        estimatedCost: place.priceLevel ? `${place.priceLevel * 10}-${place.priceLevel * 20} USD` : 'Free',
        bestTimeToVisit: 'Morning',
        tips: `Rating: ${place.rating || 'N/A'}/5`,
        location: place.location
      }));

      res.json({
        success: true,
        data: suggestions,
        source: 'places_api'
      });

    } catch (placesError) {
      res.status(500).json({
        success: false,
        message: 'Unable to generate activity suggestions at the moment'
      });
    }
  }
}));

// @desc    Reorder activities in a day
// @route   PUT /api/itinerary/:tripId/days/:dayNumber/reorder
// @access  Private
router.put('/:tripId/days/:dayNumber/reorder', asyncHandler(async (req, res) => {
  const { tripId, dayNumber } = req.params;
  const { activityIds } = req.body;

  if (!Array.isArray(activityIds)) {
    return res.status(400).json({
      success: false,
      message: 'activityIds must be an array'
    });
  }

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  const dayIndex = parseInt(dayNumber) - 1;
  if (dayIndex < 0 || dayIndex >= trip.itinerary.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid day number'
    });
  }

  const day = trip.itinerary[dayIndex];
  const currentActivities = day.activities;

  // Validate all activity IDs exist
  const validIds = activityIds.every(id => 
    currentActivities.find(activity => activity._id.toString() === id)
  );

  if (!validIds || activityIds.length !== currentActivities.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid activity IDs or missing activities'
    });
  }

  // Reorder activities
  const reorderedActivities = activityIds.map(id => 
    currentActivities.find(activity => activity._id.toString() === id)
  );

  day.activities = reorderedActivities;
  await trip.save();

  res.json({
    success: true,
    message: 'Activities reordered successfully',
    data: day.activities
  });
}));

// @desc    Update day information
// @route   PUT /api/itinerary/:tripId/days/:dayNumber
// @access  Private
router.put('/:tripId/days/:dayNumber', asyncHandler(async (req, res) => {
  const { tripId, dayNumber } = req.params;
  const { theme, notes } = req.body;

  const trip = await Trip.findOne({
    _id: tripId,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  const dayIndex = parseInt(dayNumber) - 1;
  if (dayIndex < 0 || dayIndex >= trip.itinerary.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid day number'
    });
  }

  const day = trip.itinerary[dayIndex];
  
  if (theme !== undefined) day.theme = theme;
  if (notes !== undefined) day.notes = notes;

  await trip.save();

  res.json({
    success: true,
    message: 'Day updated successfully',
    data: day
  });
}));

export default router;
"""

with open("travel-backend/routes/itinerary.js", "w") as f:
    f.write(itinerary_routes)

print("User and Itinerary routes created successfully!")