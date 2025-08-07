// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const duplicateFields = Object.keys(err.keyValue);
    const message = `Duplicate field value entered: ${duplicateFields.join(', ')}`;
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(val => val.message)
      .join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      message,
      statusCode: 401
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large';
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files uploaded';
    error = {
      message,
      statusCode: 400
    };
  }

  // API rate limit errors
  if (err.status === 429) {
    const message = 'Too many requests, please try again later';
    error = {
      message,
      statusCode: 429
    };
  }

  // Network/API errors
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    const message = 'External service unavailable';
    error = {
      message,
      statusCode: 503
    };
  }

  // OpenAI API errors
  if (err.status === 401 && err.message?.includes('API key')) {
    const message = 'AI service configuration error';
    error = {
      message,
      statusCode: 503
    };
  }

  if (err.status === 429 && err.message?.includes('quota')) {
    const message = 'AI service quota exceeded, please try again later';
    error = {
      message,
      statusCode: 503
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

// Async error handler wrapper
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Not Found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error handler
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: message
      });
    }

    next();
  };
};
