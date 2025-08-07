# Create .env template file
env_template = """# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travel-assistant
# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-assistant?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=30d

# OpenAI API Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Alternative AI APIs (Free options for hackathon)
GROQ_API_KEY=your-groq-api-key-here
HUGGINGFACE_API_KEY=your-huggingface-api-key-here

# Google APIs (Optional)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
GOOGLE_PLACES_API_KEY=your-google-places-api-key-here

# Weather API
OPENWEATHER_API_KEY=your-openweather-api-key-here

# Email Configuration (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=5000000
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
"""

with open("travel-backend/.env.example", "w") as f:
    f.write(env_template)

print(".env.example template created successfully!")
print("Remember to create a .env file based on this template with your actual API keys.")