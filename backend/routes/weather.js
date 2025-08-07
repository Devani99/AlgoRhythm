import express from 'express';
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
