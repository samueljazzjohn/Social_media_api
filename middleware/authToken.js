const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = require('../config/appconfig').auth.jwt_secret

function authenticateToken(req, res, next) {
  // Get the JWT token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If token is not provided, return a 401 status code
  if (!token) {
    return res.status(401).json({ message: 'Access token not provided' });
  }

  // Verify the token using the secret key
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Set the authenticated user ID in the request object
    req.user = user;

    // Call the next middleware function
    next();
  });
}


module.exports = {'authenticateToken':authenticateToken}