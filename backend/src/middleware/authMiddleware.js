const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';

/**
 * Verify JWT token and attach staff info to request
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token type is correct
    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    // Attach decoded info to request
    req.staff_id = decoded.staff_id;
    req.staff_name = decoded.staff_name;
    req.email = decoded.email;
    req.roles = decoded.roles || [];

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Check if user has required role(s)
 * Usage: requireRole('Admin', 'HOD')(req, res, next)
 */
const requireRole = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.roles) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const hasRole = requiredRoles.some(role => req.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: `Required roles: ${requiredRoles.join(' or ')}`
      });
    }

    next();
  };
};

/**
 * Check if user is authenticated (any role)
 */
const isAuthenticated = (req, res, next) => {
  if (!req.staff_id) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireRole,
  isAuthenticated
};
