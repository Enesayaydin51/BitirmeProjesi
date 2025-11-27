const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.message.includes('Validation failed')) {
    statusCode = 400;
    message = err.message;
  } else if (err.message.includes('already exists')) {
    statusCode = 409;
    message = err.message;
  } else if (err.message.includes('Invalid email or password')) {
    statusCode = 401;
    message = err.message;
  }

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
};

module.exports = { errorHandler };
