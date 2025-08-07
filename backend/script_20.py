# Let's create a comprehensive file listing of all created files
import os

def list_files_recursively(directory):
    file_list = []
    for root, dirs, files in os.walk(directory):
        # Skip hidden directories and node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
        
        for file in files:
            if not file.startswith('.'):
                rel_path = os.path.relpath(os.path.join(root, file), directory)
                file_list.append(rel_path)
    return sorted(file_list)

if os.path.exists('travel-backend'):
    files = list_files_recursively('travel-backend')
    
    print("🗂️  Complete file listing of your Virtual Travel Assistant Backend:")
    print("=" * 70)
    
    for file in files:
        print(f"📄 {file}")
    
    print("\n" + "=" * 70)
    print(f"📊 Total files created: {len(files)}")
    
    # Count files by category
    categories = {
        'Configuration': ['.env.example', '.gitignore', '.dockerignore', 'package.json', 'README.md'],
        'Core Files': ['server.js'],
        'Database Config': ['config/database.js'],
        'Models': ['models/User.js', 'models/Trip.js'],
        'Middleware': ['middleware/auth.js', 'middleware/errorHandler.js'],
        'Routes': ['routes/auth.js', 'routes/trips.js', 'routes/users.js', 'routes/itinerary.js', 'routes/places.js', 'routes/weather.js'],
        'Services': ['services/aiService.js', 'services/weatherService.js', 'services/placesService.js'],
        'Utils': ['utils/validation.js', 'utils/pdfGenerator.js'],
        'Uploads': ['uploads/.gitkeep']
    }
    
    print("\n📋 Files by category:")
    for category, expected_files in categories.items():
        actual_files = [f for f in files if any(f.endswith(ef.split('/')[-1]) or f == ef for ef in expected_files)]
        print(f"  {category}: {len(actual_files)} files")
    
    print(f"\n✨ Your hackathon-ready backend is complete with {len(files)} files!")
else:
    print("❌ travel-backend directory not found")