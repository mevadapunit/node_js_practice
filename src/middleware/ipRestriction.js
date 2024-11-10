const ipRestriction = (req, res, next) => {
    let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
  
    if (clientIp && clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim();
    }
  
    if (clientIp === '::1') {
      clientIp = '127.0.0.1';
    }
  
    // Log client IP for debugging
    console.log('Client IP:', clientIp);
  
    // Array of allowed IPs
    const allowedIps = [
      '127.0.0.1',     // Localhost IPv4
      '::1',           // Localhost IPv6
    ];
  
    if (!allowedIps.includes(clientIp)) {
      console.log('Access denied from IP:', clientIp);
      return res.status(403).json({
        message: 'Access forbidden: Your IP is not authorized to access this API.'
      });
    }
  
    next();
  };
  
  module.exports = ipRestriction;
  