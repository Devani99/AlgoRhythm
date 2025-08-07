# Create validation utilities
validation_utils = """import Joi from 'joi';

// User validation schemas
export const userValidation = {
  // Register user validation
  register: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters'
      }),
    
    email: Joi.string()
      .email()
      .lowercase()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),
    
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required'
      })
  }),

  // Login user validation
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'string.empty': 'Password is required'
      })
  }),

  // Update profile validation
  updateProfile: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .optional(),
    
    preferences: Joi.object({
      currency: Joi.string()
        .valid('USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY')
        .optional(),
      
      language: Joi.string()
        .valid('en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko')
        .optional(),
      
      travelStyle: Joi.string()
        .valid('budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation')
        .optional(),
      
      accommodationType: Joi.string()
        .valid('hostel', 'hotel', 'resort', 'apartment', 'house', 'any')
        .optional(),
      
      dietaryRestrictions: Joi.array()
        .items(Joi.string().valid('vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'none'))
        .optional(),
      
      travelPace: Joi.string()
        .valid('slow', 'moderate', 'fast')
        .optional()
    }).optional()
  })
};

// Trip validation schemas
export const tripValidation = {
  // Create trip validation
  create: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Trip title is required',
        'string.max': 'Trip title cannot exceed 100 characters'
      }),
    
    description: Joi.string()
      .trim()
      .max(500)
      .optional()
      .allow('')
      .messages({
        'string.max': 'Description cannot exceed 500 characters'
      }),
    
    destination: Joi.object({
      city: Joi.string()
        .trim()
        .required()
        .messages({
          'string.empty': 'Destination city is required'
        }),
      
      country: Joi.string()
        .trim()
        .required()
        .messages({
          'string.empty': 'Destination country is required'
        }),
      
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).optional(),
        longitude: Joi.number().min(-180).max(180).optional()
      }).optional(),
      
      timezone: Joi.string().optional(),
      placeId: Joi.string().optional()
    }).required(),
    
    startDate: Joi.date()
      .iso()
      .min('now')
      .required()
      .messages({
        'date.base': 'Start date must be a valid date',
        'date.min': 'Start date cannot be in the past'
      }),
    
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.base': 'End date must be a valid date',
        'date.greater': 'End date must be after start date'
      }),
    
    travelers: Joi.object({
      adults: Joi.number()
        .integer()
        .min(1)
        .max(20)
        .default(1),
      
      children: Joi.number()
        .integer()
        .min(0)
        .max(10)
        .default(0),
      
      infants: Joi.number()
        .integer()
        .min(0)
        .max(5)
        .default(0)
    }).optional(),
    
    preferences: Joi.object({
      themes: Joi.array()
        .items(Joi.string().valid(
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
        ))
        .optional(),
      
      pace: Joi.string()
        .valid('slow', 'moderate', 'fast')
        .default('moderate'),
      
      weatherPreference: Joi.string()
        .valid('warm', 'cool', 'mild', 'any')
        .default('any'),
      
      accommodationType: Joi.string()
        .valid('budget', 'mid-range', 'luxury', 'any')
        .default('any'),
      
      foodPreferences: Joi.array()
        .items(Joi.string().valid(
          'local-cuisine',
          'international',
          'vegetarian',
          'vegan',
          'halal',
          'kosher',
          'gluten-free'
        ))
        .optional(),
      
      transportPreference: Joi.string()
        .valid('public', 'taxi-uber', 'rental-car', 'walking', 'mixed')
        .default('mixed')
    }).optional(),
    
    budget: Joi.object({
      total: Joi.number()
        .min(0)
        .required()
        .messages({
          'number.min': 'Budget must be a positive number'
        }),
      
      currency: Joi.string()
        .valid('USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY')
        .default('USD'),
      
      breakdown: Joi.object({
        accommodation: Joi.number().min(0).optional(),
        food: Joi.number().min(0).optional(),
        activities: Joi.number().min(0).optional(),
        transportation: Joi.number().min(0).optional(),
        shopping: Joi.number().min(0).optional(),
        miscellaneous: Joi.number().min(0).optional()
      }).optional()
    }).optional()
  }),

  // Update trip validation
  update: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .optional(),
    
    description: Joi.string()
      .trim()
      .max(500)
      .optional()
      .allow(''),
    
    startDate: Joi.date()
      .iso()
      .optional(),
    
    endDate: Joi.date()
      .iso()
      .optional(),
    
    travelers: Joi.object({
      adults: Joi.number().integer().min(1).max(20).optional(),
      children: Joi.number().integer().min(0).max(10).optional(),
      infants: Joi.number().integer().min(0).max(5).optional()
    }).optional(),
    
    preferences: Joi.object().optional(), // Same as create schema
    
    budget: Joi.object().optional(), // Same as create schema
    
    status: Joi.string()
      .valid('planning', 'confirmed', 'ongoing', 'completed', 'cancelled')
      .optional(),
    
    isPublic: Joi.boolean().optional()
  })
};

// Activity validation schemas
export const activityValidation = {
  // Create/Update activity validation
  activity: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Activity name is required',
        'string.max': 'Activity name cannot exceed 100 characters'
      }),
    
    description: Joi.string()
      .trim()
      .max(500)
      .optional()
      .allow(''),
    
    category: Joi.string()
      .valid(
        'sightseeing',
        'food',
        'activity',
        'transport',
        'accommodation',
        'shopping',
        'entertainment',
        'other'
      )
      .default('other'),
    
    location: Joi.object({
      name: Joi.string().trim().optional().allow(''),
      address: Joi.string().trim().optional().allow(''),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).optional(),
        longitude: Joi.number().min(-180).max(180).optional()
      }).optional(),
      placeId: Joi.string().optional()
    }).optional(),
    
    duration: Joi.object({
      hours: Joi.number().integer().min(0).max(24).default(1),
      minutes: Joi.number().integer().min(0).max(59).default(0)
    }).optional(),
    
    estimatedCost: Joi.object({
      min: Joi.number().min(0).default(0),
      max: Joi.number().min(0).default(0),
      currency: Joi.string()
        .valid('USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY')
        .default('USD')
    }).optional(),
    
    timeSlot: Joi.object({
      startTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .default('09:00')
        .messages({
          'string.pattern.base': 'Time must be in HH:MM format'
        }),
      
      endTime: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .default('10:00')
        .messages({
          'string.pattern.base': 'Time must be in HH:MM format'
        })
    }).optional(),
    
    priority: Joi.string()
      .valid('low', 'medium', 'high')
      .default('medium'),
    
    bookingInfo: Joi.object({
      isBookingRequired: Joi.boolean().default(false),
      bookingUrl: Joi.string().uri().optional().allow(''),
      contactInfo: Joi.string().trim().optional().allow('')
    }).optional(),
    
    notes: Joi.string()
      .trim()
      .max(300)
      .optional()
      .allow(''),
    
    completed: Joi.boolean().default(false)
  })
};

// Query validation schemas
export const queryValidation = {
  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),
  
  // Search validation
  search: Joi.object({
    q: Joi.string().trim().min(1).max(100).optional(),
    category: Joi.string().optional(),
    status: Joi.string()
      .valid('planning', 'confirmed', 'ongoing', 'completed', 'cancelled')
      .optional()
  }),
  
  // Places search validation
  placesSearch: Joi.object({
    q: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Search query is required'
      }),
    
    lat: Joi.number().min(-90).max(90).optional(),
    lng: Joi.number().min(-180).max(180).optional(),
    radius: Joi.number().integer().min(100).max(50000).default(10000),
    type: Joi.string().optional()
  }),
  
  // Weather validation
  weather: Joi.object({
    city: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'City is required'
      }),
    
    country: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'Country is required'
      }),
    
    units: Joi.string()
      .valid('metric', 'imperial')
      .default('metric'),
    
    days: Joi.number().integer().min(1).max(5).default(5),
    
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
  })
};

// Middleware function to validate request data
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
      allowUnknown: false // Don't allow unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Replace req.body with validated/sanitized data
    req.body = value;
    next();
  };
};

// Middleware function to validate query parameters
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors
      });
    }

    req.query = value;
    next();
  };
};

export default {
  userValidation,
  tripValidation,
  activityValidation,
  queryValidation,
  validate,
  validateQuery
};
"""

with open("travel-backend/utils/validation.js", "w") as f:
    f.write(validation_utils)

print("Validation utilities created successfully!")