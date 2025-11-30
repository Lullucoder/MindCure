export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: true,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};
