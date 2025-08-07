import express from 'express';
import Trip from '../models/Trip.js';
import aiService from '../services/aiService.js';
import weatherService from '../services/weatherService.js';
import placesService from '../services/placesService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get all trips for the authenticated user
// @route   GET /api/trips
// @access  Private
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const skip = (page - 1) * limit;

  // Build query
  let query = { user: req.user._id };

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'destination.city': { $regex: search, $options: 'i' } },
      { 'destination.country': { $regex: search, $options: 'i' } }
    ];
  }

  const trips = await Trip.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Trip.countDocuments(query);

  res.json({
    success: true,
    data: {
      trips: trips.map(trip => trip.getSummary()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    }
  });
}));

// @desc    Get a specific trip by ID
// @route   GET /api/trips/:id
// @access  Private
router.get('/:id', asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  res.json({
    success: true,
    data: trip
  });
}));

// @desc    Create a new trip with AI-generated itinerary
// @route   POST /api/trips
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  const {
    title,
    description,
    destination,
    startDate,
    endDate,
    travelers = { adults: 1, children: 0, infants: 0 },
    preferences = {},
    budget
  } = req.body;

  // Validate required fields
  if (!title || !destination?.city || !destination?.country || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: title, destination, startDate, endDate'
    });
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  if (start >= end) {
    return res.status(400).json({
      success: false,
      message: 'End date must be after start date'
    });
  }

  if (start < today.setHours(0, 0, 0, 0)) {
    return res.status(400).json({
      success: false,
      message: 'Start date cannot be in the past'
    });
  }

  // Calculate duration
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (duration > 30) {
    return res.status(400).json({
      success: false,
      message: 'Trip duration cannot exceed 30 days'
    });
  }

  // Create trip data for AI generation
  const tripData = {
    title,
    description,
    destination,
    startDate,
    endDate,
    duration,
    travelers,
    preferences,
    budget
  };

  try {
    // Generate itinerary using AI
    const aiResult = await aiService.generateItinerary(tripData);

    // Get weather forecast for the trip
    let weatherInfo = null;
    try {
      weatherInfo = await weatherService.getWeatherForTrip(
        destination.city,
        destination.country,
        startDate,
        endDate
      );
    } catch (weatherError) {
      console.warn('Weather service unavailable:', weatherError.message);
    }

    // Create trip in database
    const trip = await Trip.create({
      user: req.user._id,
      title,
      description,
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      preferences,
      budget: budget || { total: 0, currency: 'USD' },
      itinerary: aiResult.itinerary,
      generationPrompt: `Trip to ${destination.city}, ${destination.country} for ${duration} days`,
      status: 'planning'
    });

    // Add weather information to itinerary if available
    if (weatherInfo && weatherInfo.forecast) {
      for (let i = 0; i < trip.itinerary.length && i < weatherInfo.forecast.length; i++) {
        trip.itinerary[i].weather = {
          temperature: weatherInfo.forecast[i].temperature,
          condition: weatherInfo.forecast[i].condition?.main || weatherInfo.forecast[i].condition,
          precipitation: weatherInfo.forecast[i].precipitation || 0,
          humidity: weatherInfo.forecast[i].humidity
        };
      }
      await trip.save();
    }

    res.status(201).json({
      success: true,
      message: 'Trip created successfully with AI-generated itinerary',
      data: {
        trip,
        aiInfo: {
          totalBudgetEstimate: aiResult.totalBudgetEstimate,
          generalTips: aiResult.generalTips,
          bestTimeToVisit: aiResult.bestTimeToVisit,
          localCustoms: aiResult.localCustoms
        },
        weatherInfo: weatherInfo ? {
          forecast: weatherInfo.forecast?.slice(0, 5) // First 5 days
        } : null
      }
    });

  } catch (error) {
    console.error('Trip creation error:', error);

    // If AI generation fails, create a basic trip structure
    const basicTrip = await Trip.create({
      user: req.user._id,
      title,
      description,
      destination,
      startDate,
      endDate,
      duration,
      travelers,
      preferences,
      budget: budget || { total: 0, currency: 'USD' },
      itinerary: [], // Empty itinerary to be filled manually
      aiGenerated: false,
      status: 'planning'
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully. AI itinerary generation failed, but you can add activities manually.',
      data: {
        trip: basicTrip,
        warning: 'AI service unavailable. Please add activities manually.'
      }
    });
  }
}));

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
router.put('/:id', asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  // Update allowed fields
  const allowedFields = [
    'title', 'description', 'startDate', 'endDate', 
    'travelers', 'preferences', 'budget', 'status', 'isPublic'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Validate date updates if provided
  if (updates.startDate || updates.endDate) {
    const startDate = new Date(updates.startDate || trip.startDate);
    const endDate = new Date(updates.endDate || trip.endDate);

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Recalculate duration if dates changed
    if (updates.startDate || updates.endDate) {
      updates.duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    }
  }

  Object.assign(trip, updates);
  await trip.save();

  res.json({
    success: true,
    message: 'Trip updated successfully',
    data: trip
  });
}));

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
router.delete('/:id', asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  await Trip.deleteOne({ _id: trip._id });

  res.json({
    success: true,
    message: 'Trip deleted successfully'
  });
}));

// @desc    Like/unlike a public trip
// @route   POST /api/trips/:id/like
// @access  Private
router.post('/:id/like', asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    isPublic: true
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Public trip not found'
    });
  }

  const userId = req.user._id;
  const hasLiked = trip.likes.includes(userId);

  if (hasLiked) {
    // Unlike
    trip.likes = trip.likes.filter(id => !id.equals(userId));
  } else {
    // Like
    trip.likes.push(userId);
  }

  await trip.save();

  res.json({
    success: true,
    message: hasLiked ? 'Trip unliked' : 'Trip liked',
    data: {
      liked: !hasLiked,
      likesCount: trip.likes.length
    }
  });
}));

// @desc    Add comment to a public trip
// @route   POST /api/trips/:id/comments
// @access  Private
router.post('/:id/comments', asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Comment text is required'
    });
  }

  const trip = await Trip.findOne({
    _id: req.params.id,
    isPublic: true
  });

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Public trip not found'
    });
  }

  trip.comments.push({
    user: req.user._id,
    text: text.trim(),
    createdAt: new Date()
  });

  await trip.save();

  // Populate user info in the new comment
  await trip.populate('comments.user', 'name avatar');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: trip.comments[trip.comments.length - 1]
  });
}));

// @desc    Get public trips (discover feed)
// @route   GET /api/trips/public
// @access  Public (but requires auth for personalization)
router.get('/public/discover', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, destination, themes } = req.query;
  const skip = (page - 1) * limit;

  let query = { isPublic: true };

  if (destination) {
    query.$or = [
      { 'destination.city': { $regex: destination, $options: 'i' } },
      { 'destination.country': { $regex: destination, $options: 'i' } }
    ];
  }

  if (themes) {
    const themeArray = themes.split(',');
    query['preferences.themes'] = { $in: themeArray };
  }

  const trips = await Trip.find(query)
    .populate('user', 'name avatar')
    .sort({ likes: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Trip.countDocuments(query);

  res.json({
    success: true,
    data: {
      trips: trips.map(trip => ({
        ...trip.getSummary(),
        user: trip.user,
        likesCount: trip.likes.length,
        commentsCount: trip.comments.length,
        liked: req.user ? trip.likes.includes(req.user._id) : false
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    }
  });
}));

export default router;
