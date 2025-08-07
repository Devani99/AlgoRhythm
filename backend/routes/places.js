import express from 'express';
import placesService from '../services/placesService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Search for places by text query
// @route   GET /api/places/search
// @access  Private
router.get('/search', asyncHandler(async (req, res) => {
  const { q: query, lat, lng, radius = 10000, type } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const location = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null;

  try {
    const places = await placesService.searchPlaces(
      query,
      location,
      parseInt(radius),
      type
    );

    res.json({
      success: true,
      data: places
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get place details by place ID
// @route   GET /api/places/details/:placeId
// @access  Private
router.get('/details/:placeId', asyncHandler(async (req, res) => {
  const { placeId } = req.params;

  if (!placeId) {
    return res.status(400).json({
      success: false,
      message: 'Place ID is required'
    });
  }

  try {
    const placeDetails = await placesService.getPlaceDetails(placeId);

    res.json({
      success: true,
      data: placeDetails
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Find nearby places by type
// @route   GET /api/places/nearby
// @access  Private
router.get('/nearby', asyncHandler(async (req, res) => {
  const { lat, lng, radius = 1500, type = 'tourist_attraction' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }

  const location = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  try {
    const places = await placesService.findNearbyPlaces(
      location,
      parseInt(radius),
      type
    );

    res.json({
      success: true,
      data: places
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get popular attractions for a city
// @route   GET /api/places/attractions
// @access  Private
router.get('/attractions', asyncHandler(async (req, res) => {
  const { city, country, limit = 20 } = req.query;

  if (!city || !country) {
    return res.status(400).json({
      success: false,
      message: 'City and country are required'
    });
  }

  try {
    const attractions = await placesService.getPopularAttractions(
      city,
      country,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: attractions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get restaurants for a location
// @route   GET /api/places/restaurants
// @access  Private
router.get('/restaurants', asyncHandler(async (req, res) => {
  const { city, country, cuisine, priceLevel, limit = 15 } = req.query;

  if (!city || !country) {
    return res.status(400).json({
      success: false,
      message: 'City and country are required'
    });
  }

  try {
    const restaurants = await placesService.getRestaurants(
      city,
      country,
      cuisine,
      priceLevel ? parseInt(priceLevel) : null,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: restaurants
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get accommodations for a location
// @route   GET /api/places/accommodations
// @access  Private
router.get('/accommodations', asyncHandler(async (req, res) => {
  const { city, country, type = 'lodging', limit = 10 } = req.query;

  if (!city || !country) {
    return res.status(400).json({
      success: false,
      message: 'City and country are required'
    });
  }

  try {
    const accommodations = await placesService.getAccommodations(
      city,
      country,
      type,
      parseInt(limit)
    );

    res.json({
      success: true,
      data: accommodations
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

export default router;
