# Create package.json file
package_json = """{
  "name": "virtual-travel-assistant-backend",
  "version": "1.0.0",
  "description": "AI-powered travel planning backend for hackathon project",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "openai": "^4.20.1",
    "axios": "^1.5.0",
    "multer": "^1.4.5-lts.1",
    "compression": "^1.7.4",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.10.0",
    "puppeteer": "^21.3.6",
    "pdfkit": "^0.14.0",
    "node-cron": "^3.0.2",
    "joi": "^17.10.1",
    "morgan": "^1.10.0",
    "sharp": "^0.32.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": [
    "travel",
    "ai",
    "itinerary",
    "planning",
    "hackathon",
    "backend"
  ],
  "author": "Your Name",
  "license": "MIT"
}
"""

with open("travel-backend/package.json", "w") as f:
    f.write(package_json)

print("package.json created successfully!")