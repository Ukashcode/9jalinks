// Catches requests to routes that don't exist and forwards a 404
// as a normal error, so it flows through the same errorHandler below.
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Single place where every error in the app ends up. Keeps controllers
// free of repetitive status-code/response formatting logic.
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server error';

  // MySQL duplicate entry (e.g. email or username already taken)
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'A record with these details already exists';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};