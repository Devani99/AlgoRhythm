# Create Trip model
trip_model = """import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'activity', 'transport', 'accommodation', 'shopping', 'entertainment', 'other'],
    default: 'other'
  },
  location: {
    name: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    placeId: String // Google Places ID
  },
  duration: {
    hours: Number,
    minutes: Number
  },
  estimatedCost: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  timeSlot: {
    startTime: String, // Format: "HH:MM"
    endTime: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  bookingInfo: {
    isBookingRequired: {
      type: Boolean,
      default: false
    },
    bookingUrl: String,
    contactInfo: String
  },
  notes: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const dayPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  theme: String, // e.g., "Historical Sites", "Local Cuisine", "Nature & Adventure"
  activities: [activitySchema],
  weather: {
    temperature: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      }
    },
    condition: String,
    precipitation: Number,
    humidity: Number
  },
  totalEstimatedCost: {
    amount: Number,
    currency: String
  },
  notes: String
});

const budgetSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  breakdown: {
    accommodation: Number,
    food: Number,
    activities: Number,
    transportation: Number,
    shopping: Number,
    miscellaneous: Number
  },
  actualSpent: {
    type: Number,
    default: 0
  }
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [100, 'Trip title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  destination: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    timezone: String,
    placeId: String // Google Places ID
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  duration: {
    type: Number, // in days
    required: true
  },
  travelers: {
    adults: {
      type: Number,
      default: 1,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  preferences: {
    themes: [{
      type: String,
      enum: [
        'historical-sites',
        'local-culture',
        'food-dining',
        'nightlife',
        'shopping',
        'nature-wildlife',
        'adventure',
        'beaches',
        'relaxation',
        'photography',
        'family-friendly'
      ]
    }],
    pace: {
      type: String,
      enum: ['slow', 'moderate', 'fast'],
      default: 'moderate'
    },
    weatherPreference: {
      type: String,
      enum: ['warm', 'cool', 'mild', 'any'],
      default: 'any'
    },
    accommodationType: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury', 'any'],
      default: 'any'
    },
    foodPreferences: [{
      type: String,
      enum: ['local-cuisine', 'international', 'vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free']
    }],
    transportPreference: {
      type: String,
      enum: ['public', 'taxi-uber', 'rental-car', 'walking', 'mixed'],
      default: 'mixed'
    }
  },
  budget: budgetSchema,
  itinerary: [dayPlanSchema],
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  aiGenerated: {
    type: Boolean,
    default: true
  },
  generationPrompt: String, // Store the original prompt used for AI generation
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total trip cost
tripSchema.virtual('totalCost').get(function() {
  let total = 0;
  this.itinerary.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.estimatedCost && activity.estimatedCost.max) {
        total += activity.estimatedCost.max;
      }
    });
  });
  return total;
});

// Virtual for days remaining
tripSchema.virtual('daysRemaining').get(function() {
  const today = new Date();
  const start = new Date(this.startDate);
  const diffTime = start - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for progress percentage
tripSchema.virtual('progressPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'planning') return 0;
  
  const totalActivities = this.itinerary.reduce((total, day) => total + day.activities.length, 0);
  const completedActivities = this.itinerary.reduce((total, day) => {
    return total + day.activities.filter(activity => activity.completed).length;
  }, 0);
  
  return totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
});

// Indexes for better performance
tripSchema.index({ user: 1, startDate: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ isPublic: 1, likes: -1 });
tripSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate duration
tripSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = new Date(this.endDate) - new Date(this.startDate);
    this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  this.lastModified = new Date();
  next();
});

// Static method to find public trips
tripSchema.statics.findPublicTrips = function(limit = 10) {
  return this.find({ isPublic: true })
    .populate('user', 'name avatar')
    .sort({ likes: -1, createdAt: -1 })
    .limit(limit);
};

// Method to get trip summary
tripSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    title: this.title,
    destination: this.destination,
    startDate: this.startDate,
    endDate: this.endDate,
    duration: this.duration,
    status: this.status,
    totalCost: this.totalCost,
    progressPercentage: this.progressPercentage,
    daysRemaining: this.daysRemaining
  };
};

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
"""

with open("travel-backend/models/Trip.js", "w") as f:
    f.write(trip_model)

print("Trip model created successfully!")