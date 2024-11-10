const forbidden = (req, res) => {
  res.status(403).json({
      status: 'error',
      message: 'Forbidden: You do not have permission to access this resource.',
  });
};

module.exports = forbidden;
