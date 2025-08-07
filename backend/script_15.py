# Create remaining route files
places_routes = """import express from 'express';
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
"""

weather_routes = """import express from 'express';
import weatherService from '../services/weatherService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get current weather for a destination
// @route   GET /api/weather/current
// @access  Private
router.get('/current', asyncHandler(async (req, res) => {
  const { city, country, units = 'metric' } = req.query;

  if (!city || !country) {
    return res.status(400).json({
      success: false,
      message: 'City and country are required'
    });
  }

  try {
    const weather = await weatherService.getCurrentWeather(city, country, units);

    res.json({
      success: true,
      data: weather
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get weather forecast for multiple days
// @route   GET /api/weather/forecast
// @access  Private
router.get('/forecast', asyncHandler(async (req, res) => {
  const { city, country, days = 5, units = 'metric' } = req.query;

  if (!city || !country) {
    return res.status(400).json({
      success: false,
      message: 'City and country are required'
    });
  }

  const numDays = Math.min(parseInt(days), 5); // Limit to 5 days

  try {
    const forecast = await weatherService.getWeatherForecast(city, country, numDays, units);

    res.json({
      success: true,
      data: forecast
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get weather for specific trip dates
// @route   GET /api/weather/trip
// @access  Private
router.get('/trip', asyncHandler(async (req, res) => {
  const { city, country, startDate, endDate, units = 'metric' } = req.query;

  if (!city || !country || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'City, country, startDate, and endDate are required'
    });
  }

  // Validate date format
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Use YYYY-MM-DD'
    });
  }

  if (start >= end) {
    return res.status(400).json({
      success: false,
      message: 'End date must be after start date'
    });
  }

  try {
    const weatherData = await weatherService.getWeatherForTrip(
      city,
      country,
      startDate,
      endDate,
      units
    );

    // Get weather recommendations
    const recommendations = weatherData.forecast 
      ? weatherData.forecast.map(day => ({
          date: day.date,
          recommendations: weatherService.getWeatherRecommendations(day)
        }))
      : [{ 
          date: startDate,
          recommendations: weatherService.getWeatherRecommendations(weatherData)
        }];

    res.json({
      success: true,
      data: {
        ...weatherData,
        recommendations
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

// @desc    Get weather recommendations for activities
// @route   GET /api/weather/recommendations
// @access  Private
router.get('/recommendations', asyncHandler(async (req, res) => {
  const { city, country, units = 'metric' } = req.query;

  if (!city || !country) {
    return res.status(400).json({
      success: false,
      message: 'City and country are required'
    });
  }

  try {
    const weather = await weatherService.getCurrentWeather(city, country, units);
    const recommendations = weatherService.getWeatherRecommendations(weather);

    res.json({
      success: true,
      data: {
        weather: weather.current,
        recommendations
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}));

export default router;
"""

# Write the files
with open("travel-backend/routes/places.js", "w") as f:
    f.write(places_routes)

with open("travel-backend/routes/weather.js", "w") as f:
    f.write(weather_routes)

print("Places and Weather routes created successfully!")