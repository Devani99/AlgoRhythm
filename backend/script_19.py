# Create additional utility files
# .gitignore file
gitignore_content = """# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Vue.js build output
dist/

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Temporary folders
tmp/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Uploads directory (files uploaded by users)
uploads/*.pdf
uploads/*.jpg
uploads/*.jpeg
uploads/*.png
uploads/*.gif

# Keep uploads directory but ignore files
!uploads/.gitkeep

# Database files (if using local database files)
*.db
*.sqlite
*.sqlite3

# SSL certificates
*.pem
*.key
*.crt

# Production config files
config/production.json

# PM2 files
ecosystem.config.js
"""

docker_ignore = """node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.grunt
"""

with open("travel-backend/.gitignore", "w") as f:
    f.write(gitignore_content)

with open("travel-backend/.dockerignore", "w") as f:
    f.write(docker_ignore)

# Create uploads directory placeholder
uploads_gitkeep = """# This file ensures the uploads directory is tracked by Git
# Actual upload files are ignored in .gitignore
"""

with open("travel-backend/uploads/.gitkeep", "w") as f:
    f.write(uploads_gitkeep)

print("Additional configuration files created successfully!")
print("\n🎉 Complete Virtual Travel Assistant Backend has been generated!")
print("\n📁 Project structure:")
print("travel-backend/")
print("├── config/database.js")
print("├── controllers/")
print("├── middleware/")
print("├── models/")
print("├── routes/")
print("├── services/")
print("├── utils/")
print("├── uploads/")
print("├── .env.example")
print("├── .gitignore")
print("├── .dockerignore")
print("├── package.json")
print("├── README.md")
print("└── server.js")
print("\n🚀 Next steps:")
print("1. Copy the travel-backend folder to your project directory")
print("2. Run 'npm install' to install dependencies") 
print("3. Copy .env.example to .env and fill in your API keys")
print("4. Start MongoDB (local or use MongoDB Atlas)")
print("5. Run 'npm run dev' to start the development server")
print("\n💡 The backend includes:")
print("✅ AI-powered itinerary generation (OpenAI, Groq, HuggingFace)")
print("✅ User authentication with JWT")
print("✅ Trip and itinerary management")
print("✅ Weather and places integration")
print("✅ PDF export functionality")
print("✅ Social features (likes, comments)")
print("✅ Comprehensive input validation")
print("✅ Error handling and security")
print("✅ Detailed documentation")
print("\n🔑 Get free API keys from:")
print("- Groq: console.groq.com (fastest, free)")
print("- HuggingFace: huggingface.co/settings/tokens (free)")
print("- OpenAI: platform.openai.com (paid, most advanced)")
print("- OpenWeather: openweathermap.org (free tier)")
print("- Google Places: console.cloud.google.com (free tier)")