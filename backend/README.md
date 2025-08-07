# Virtual Travel Assistant - Backend API

An AI-powered travel planning backend built for hackathon projects. This backend provides comprehensive APIs for creating personalized travel itineraries using AI services.

## 🚀 Features

- **AI-Powered Itinerary Generation**: Generates detailed day-by-day travel plans using OpenAI, Groq, or HuggingFace APIs
- **User Authentication**: Secure JWT-based authentication and authorization
- **Trip Management**: Create, update, delete, and share travel plans
- **Weather Integration**: Get weather forecasts for travel destinations
- **Places Integration**: Search for attractions, restaurants, and accommodations
- **PDF Export**: Generate PDF itineraries for trips
- **Social Features**: Like and comment on public trips
- **Comprehensive APIs**: RESTful APIs for all travel planning needs

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Services**: OpenAI GPT, Groq, HuggingFace
- **External APIs**: Google Places API, OpenWeather API
- **PDF Generation**: PDFKit
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi
- **File Upload**: Multer

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- API Keys (at least one of the following):
  - OpenAI API key (recommended)
  - Groq API key (free alternative)
  - HuggingFace API key (free alternative)
- Optional API keys for enhanced features:
  - Google Places API key
  - Google Maps API key
  - OpenWeather API key

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd travel-backend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your API keys and configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/travel-assistant

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=30d

# AI APIs (at least one required)
OPENAI_API_KEY=your-openai-api-key-here
GROQ_API_KEY=your-groq-api-key-here
HUGGINGFACE_API_KEY=your-huggingface-api-key-here

# Optional APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here
OPENWEATHER_API_KEY=your-openweather-api-key-here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### 3. Database Setup

Make sure MongoDB is running:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - just update MONGODB_URI in .env
```

### 4. Run the Application

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 🔑 Getting API Keys

### Free AI APIs (Recommended for Hackathons)

#### Groq (Free & Fast)
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Create an API key
4. Add to your `.env` file

#### HuggingFace (Free)
1. Visit [huggingface.co](https://huggingface.co)
2. Create an account
3. Go to Settings → Access Tokens
4. Create a new token
5. Add to your `.env` file

#### OpenAI (Paid)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account and add billing
3. Generate an API key
4. Add to your `.env` file

### Optional APIs

#### Google APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Places API and Maps JavaScript API
4. Create credentials (API Key)
5. Add to your `.env` file

#### OpenWeather API
1. Visit [openweathermap.org](https://openweathermap.org/api)
2. Sign up for free account
3. Get your API key
4. Add to your `.env` file

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
GET  /api/auth/profile      - Get user profile
POST /api/auth/refresh      - Refresh JWT token
POST /api/auth/logout       - Logout user
```

### Trip Management

```
GET    /api/trips           - Get user's trips
POST   /api/trips           - Create new trip (AI-generated itinerary)
GET    /api/trips/:id       - Get specific trip
PUT    /api/trips/:id       - Update trip
DELETE /api/trips/:id       - Delete trip
POST   /api/trips/:id/like  - Like/unlike public trip
GET    /api/trips/public/discover - Get public trips
```

### Itinerary Management

```
POST   /api/itinerary/:tripId/days/:day/activities     - Add activity
PUT    /api/itinerary/:tripId/days/:day/activities/:id - Update activity
DELETE /api/itinerary/:tripId/days/:day/activities/:id - Delete activity
GET    /api/itinerary/:tripId/suggestions              - Get AI suggestions
PUT    /api/itinerary/:tripId/days/:day/reorder        - Reorder activities
```

### Places & Weather

```
GET /api/places/search           - Search places
GET /api/places/details/:id      - Get place details
GET /api/places/attractions      - Get popular attractions
GET /api/places/restaurants      - Get restaurants
GET /api/weather/current         - Get current weather
GET /api/weather/forecast        - Get weather forecast
GET /api/weather/trip            - Get weather for trip dates
```

### User Management

```
GET    /api/users/profile       - Get user profile
PUT    /api/users/profile       - Update user profile
PUT    /api/users/change-password - Change password
DELETE /api/users/account       - Delete account
GET    /api/users/stats         - Get user statistics
```

## 🔍 Example Usage

### Create a Trip with AI Itinerary

```javascript
const response = await fetch('/api/trips', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    title: "Amazing Tokyo Adventure",
    description: "Exploring the vibrant culture of Tokyo",
    destination: {
      city: "Tokyo",
      country: "Japan"
    },
    startDate: "2024-03-15",
    endDate: "2024-03-22",
    travelers: {
      adults: 2,
      children: 0
    },
    preferences: {
      themes: ["local-culture", "food-dining", "historical-sites"],
      pace: "moderate",
      weatherPreference: "mild"
    },
    budget: {
      total: 2000,
      currency: "USD"
    }
  })
});

const trip = await response.json();
console.log(trip);
```

### Search for Places

```javascript
const response = await fetch('/api/places/search?q=restaurants in Tokyo&lat=35.6762&lng=139.6503', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const places = await response.json();
console.log(places.data);
```

## 🔧 Development

### Project Structure

```
travel-backend/
├── config/
│   └── database.js         # Database configuration
├── controllers/            # Route controllers (if using MVC pattern)
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── errorHandler.js    # Error handling middleware
├── models/
│   ├── User.js            # User model
│   └── Trip.js            # Trip model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── trips.js           # Trip management routes
│   ├── itinerary.js       # Itinerary management routes
│   ├── places.js          # Places search routes
│   ├── weather.js         # Weather routes
│   └── users.js           # User management routes
├── services/
│   ├── aiService.js       # AI integration service
│   ├── weatherService.js  # Weather service
│   └── placesService.js   # Places service
├── utils/
│   ├── validation.js      # Input validation schemas
│   └── pdfGenerator.js    # PDF generation utilities
├── uploads/               # File uploads directory
├── .env.example           # Environment variables template
├── package.json           # Dependencies and scripts
└── server.js              # Main application entry point
```

### Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (to be implemented)
```

### Adding New Features

1. **Models**: Add new Mongoose models in `models/`
2. **Routes**: Create new route files in `routes/`
3. **Services**: Add external API integrations in `services/`
4. **Middleware**: Add custom middleware in `middleware/`
5. **Validation**: Add validation schemas in `utils/validation.js`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   - Make sure MongoDB is running
   - Check your MONGODB_URI in .env file
   - For Atlas, ensure your IP is whitelisted

2. **AI API Errors**
   ```
   Error: Failed to generate itinerary
   ```
   - Check your API keys are valid
   - Ensure you have at least one AI API key configured
   - Check API rate limits and quotas

3. **CORS Errors**
   ```
   Access to fetch blocked by CORS policy
   ```
   - Update ALLOWED_ORIGINS in .env file
   - Add your frontend URL to the list

4. **JWT Errors**
   ```
   Error: Invalid token
   ```
   - Make sure JWT_SECRET is set in .env
   - Check token format in Authorization header
   - Verify token hasn't expired

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
```

## 🚀 Deployment

### Environment Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Set up MongoDB Atlas for cloud database
4. Configure proper CORS origins
5. Set up rate limiting
6. Enable proper logging

### Recommended Platforms

- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern platform with automatic deployments
- **DigitalOcean App Platform**: Scalable with managed databases
- **AWS/Google Cloud**: Full control with container deployment

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or issues:

1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed description

## 🎯 Hackathon Tips

- **Start Simple**: Begin with basic trip creation and AI generation
- **Use Free APIs**: Groq and HuggingFace provide excellent free alternatives to OpenAI
- **Mock Data**: The services include fallback mock data when APIs are unavailable
- **Focus on Core Features**: Get basic functionality working before adding advanced features
- **Test Early**: Use tools like Postman to test your APIs

Happy coding! 🚀
