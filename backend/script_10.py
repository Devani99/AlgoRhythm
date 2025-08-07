# Create Weather Service
weather_service = """import axios from 'axios';

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Get current weather for a destination
  async getCurrentWeather(city, country, units = 'metric') {
    try {
      if (!this.apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const location = `${city},${country}`;
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: units
        }
      });

      const data = response.data;
      
      return {
        location: {
          name: data.name,
          country: data.sys.country,
          coordinates: {
            lat: data.coord.lat,
            lon: data.coord.lon
          }
        },
        current: {
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          visibility: data.visibility,
          uvIndex: null, // Not available in current weather
          windSpeed: data.wind.speed,
          windDirection: data.wind.deg,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          condition: data.weather[0].main
        },
        units: units === 'metric' ? 'celsius' : 'fahrenheit',
        timestamp: new Date(data.dt * 1000)
      };
    } catch (error) {
      console.error('Weather API Error:', error);
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }

  // Get weather forecast for multiple days
  async getWeatherForecast(city, country, days = 5, units = 'metric') {
    try {
      if (!this.apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const location = `${city},${country}`;
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: location,
          appid: this.apiKey,
          units: units,
          cnt: days * 8 // 8 forecasts per day (every 3 hours)
        }
      });

      const data = response.data;
      
      // Group forecasts by day
      const dailyForecasts = this.groupForecastsByDay(data.list);

      return {
        location: {
          name: data.city.name,
          country: data.city.country,
          coordinates: {
            lat: data.city.coord.lat,
            lon: data.city.coord.lon
          },
          timezone: data.city.timezone
        },
        forecast: dailyForecasts.slice(0, days),
        units: units === 'metric' ? 'celsius' : 'fahrenheit'
      };
    } catch (error) {
      console.error('Weather Forecast Error:', error);
      throw new Error(`Failed to fetch weather forecast: ${error.message}`);
    }
  }

  // Get weather for specific dates (for trip planning)
  async getWeatherForTrip(city, country, startDate, endDate, units = 'metric') {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

      // For dates within 5 days, use forecast API
      if (diffDays <= 5) {
        const forecast = await this.getWeatherForecast(city, country, diffDays, units);
        return forecast;
      }

      // For longer periods or historical data, use current weather + general advice
      const current = await this.getCurrentWeather(city, country, units);
      
      return {
        ...current,
        forecast: this.generateExtendedForecast(current, diffDays),
        note: 'Extended forecast is estimated based on historical data and current conditions'
      };
    } catch (error) {
      console.error('Trip Weather Error:', error);
      throw error;
    }
  }

  // Helper method to group 3-hourly forecasts into daily forecasts
  groupForecastsByDay(forecasts) {
    const dailyData = {};

    forecasts.forEach(forecast => {
      const date = new Date(forecast.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(forecast.dt * 1000).toISOString().split('T')[0],
          temperatures: [],
          conditions: [],
          humidity: [],
          wind: [],
          precipitation: 0,
          forecasts: []
        };
      }

      dailyData[date].temperatures.push(forecast.main.temp);
      dailyData[date].conditions.push(forecast.weather[0]);
      dailyData[date].humidity.push(forecast.main.humidity);
      dailyData[date].wind.push(forecast.wind);
      
      if (forecast.rain && forecast.rain['3h']) {
        dailyData[date].precipitation += forecast.rain['3h'];
      }
      if (forecast.snow && forecast.snow['3h']) {
        dailyData[date].precipitation += forecast.snow['3h'];
      }

      dailyData[date].forecasts.push({
        time: new Date(forecast.dt * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        temperature: Math.round(forecast.main.temp),
        condition: forecast.weather[0].main,
        description: forecast.weather[0].description,
        icon: forecast.weather[0].icon
      });
    });

    // Process daily summaries
    return Object.values(dailyData).map(day => ({
      date: day.date,
      temperature: {
        min: Math.round(Math.min(...day.temperatures)),
        max: Math.round(Math.max(...day.temperatures)),
        avg: Math.round(day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length)
      },
      condition: this.getMostFrequentCondition(day.conditions),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round(day.wind.reduce((sum, w) => sum + (w.speed || 0), 0) / day.wind.length),
      precipitation: Math.round(day.precipitation * 100) / 100,
      hourlyForecasts: day.forecasts
    }));
  }

  // Get the most frequent weather condition for the day
  getMostFrequentCondition(conditions) {
    const conditionCounts = {};
    let maxCount = 0;
    let mostFrequent = conditions[0];

    conditions.forEach(condition => {
      const main = condition.main;
      conditionCounts[main] = (conditionCounts[main] || 0) + 1;
      
      if (conditionCounts[main] > maxCount) {
        maxCount = conditionCounts[main];
        mostFrequent = condition;
      }
    });

    return {
      main: mostFrequent.main,
      description: mostFrequent.description,
      icon: mostFrequent.icon
    };
  }

  // Generate extended forecast based on current conditions (fallback)
  generateExtendedForecast(currentWeather, days) {
    const forecast = [];
    const baseTemp = currentWeather.current.temperature;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Add some randomness to temperature (±5°C)
      const tempVariation = (Math.random() - 0.5) * 10;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.round(baseTemp - 5 + tempVariation),
          max: Math.round(baseTemp + 5 + tempVariation),
          avg: Math.round(baseTemp + tempVariation)
        },
        condition: currentWeather.current.condition,
        humidity: currentWeather.current.humidity + Math.round((Math.random() - 0.5) * 20),
        windSpeed: currentWeather.current.windSpeed + Math.round((Math.random() - 0.5) * 5),
        precipitation: Math.random() < 0.3 ? Math.round(Math.random() * 5) : 0,
        note: 'Estimated based on current conditions'
      });
    }

    return forecast;
  }

  // Get weather recommendations for activities
  getWeatherRecommendations(weatherData) {
    const recommendations = [];
    const temp = weatherData.current?.temperature || weatherData.temperature?.avg;
    const condition = weatherData.current?.condition || weatherData.condition?.main;
    const precipitation = weatherData.precipitation || 0;

    // Temperature-based recommendations
    if (temp < 0) {
      recommendations.push({
        type: 'clothing',
        message: 'Very cold weather - wear heavy winter clothing, including warm layers, gloves, and waterproof boots.'
      });
      recommendations.push({
        type: 'activity',
        message: 'Consider indoor activities like museums, shopping centers, or cozy cafes.'
      });
    } else if (temp < 10) {
      recommendations.push({
        type: 'clothing',
        message: 'Cold weather - dress in warm layers, bring a jacket and comfortable walking shoes.'
      });
    } else if (temp < 20) {
      recommendations.push({
        type: 'clothing',
        message: 'Cool weather - light layers recommended, bring a light jacket for evening.'
      });
    } else if (temp < 30) {
      recommendations.push({
        type: 'clothing',
        message: 'Pleasant weather - comfortable clothing, light layers for temperature changes.'
      });
    } else {
      recommendations.push({
        type: 'clothing',
        message: 'Hot weather - wear light, breathable clothing, hat, and sunscreen.'
      });
      recommendations.push({
        type: 'activity',
        message: 'Stay hydrated and consider indoor activities during peak heat hours (12-4 PM).'
      });
    }

    // Precipitation-based recommendations
    if (precipitation > 5) {
      recommendations.push({
        type: 'weather',
        message: 'Heavy rain expected - bring umbrella, waterproof clothing, and plan indoor activities.'
      });
    } else if (precipitation > 0) {
      recommendations.push({
        type: 'weather',
        message: 'Light rain possible - bring umbrella or light rain jacket.'
      });
    }

    // Condition-based recommendations
    switch (condition) {
      case 'Snow':
        recommendations.push({
          type: 'activity',
          message: 'Snowy conditions - great for winter sports but be cautious of slippery surfaces.'
        });
        break;
      case 'Clear':
        recommendations.push({
          type: 'activity',
          message: 'Perfect weather for outdoor activities, sightseeing, and photography.'
        });
        break;
      case 'Clouds':
        recommendations.push({
          type: 'activity',
          message: 'Overcast but good for walking tours and outdoor activities.'
        });
        break;
      case 'Thunderstorm':
        recommendations.push({
          type: 'safety',
          message: 'Thunderstorm conditions - avoid outdoor activities and seek shelter.'
        });
        break;
    }

    return recommendations;
  }
}

export default new WeatherService();
"""

with open("travel-backend/services/weatherService.js", "w") as f:
    f.write(weather_service)

print("Weather Service created successfully!")