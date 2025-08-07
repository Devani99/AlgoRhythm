# Create User model
user_model = """import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY']
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko']
    },
    travelStyle: {
      type: String,
      default: 'balanced',
      enum: ['budget', 'balanced', 'luxury', 'adventure', 'cultural', 'relaxation']
    },
    accommodationType: {
      type: String,
      default: 'hotel',
      enum: ['hostel', 'hotel', 'resort', 'apartment', 'house', 'any']
    },
    dietaryRestrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'none']
    }],
    travelPace: {
      type: String,
      default: 'moderate',
      enum: ['slow', 'moderate', 'fast']
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user's trips
userSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.verificationToken;
  return userObject;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

export default User;
"""

with open("travel-backend/models/User.js", "w") as f:
    f.write(user_model)

print("User model created successfully!")