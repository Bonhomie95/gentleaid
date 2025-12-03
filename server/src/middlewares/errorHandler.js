export const errorHandler = (err, req, res, next) => {
  console.error('🔥 ERROR:', err);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
