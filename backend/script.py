# Create the main backend structure files
import os

# Create directory structure
directories = [
    "travel-backend/config",
    "travel-backend/controllers", 
    "travel-backend/models",
    "travel-backend/routes",
    "travel-backend/middleware",
    "travel-backend/utils",
    "travel-backend/services",
    "travel-backend/uploads"
]

for dir in directories:
    os.makedirs(dir, exist_ok=True)

print("Directory structure created successfully!")
print("Created directories:")
for dir in directories:
    print(f"  - {dir}")