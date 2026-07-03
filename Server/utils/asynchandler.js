// Wraps an async controller function so any thrown/rejected error is
// forwarded to Express's error-handling middleware automatically,
// instead of needing a try/catch in every single controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;