import { verifyAccessToken } from '../utils/auth.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access token is required' 
    });
  }

  const user = verifyAccessToken(token);
  
  if (!user) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired access token' 
    });
  }

  req.user = user;
  next();
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'You do not have permission to access this resource' 
      });
    }

    next();
  };
};
