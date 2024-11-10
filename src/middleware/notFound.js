const notFound = (req, res) => {
  res.status(404).json({
      status: 'error',
      message: 'Not Found: The requested resource could not be found.',
      requestedUrl: req.originalUrl, 
      method: req.method 
  });
};

module.exports = notFound;
