import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// Middleware to check if user can create privileged accounts
export const canCreatePrivilegedAccount = (req, res, next) => {
  const { role } = req.body;
  
  // Only admins can create Admin or Manager accounts
  if ((role === 'Admin' || role === 'Manager') && req.user.role !== 'Admin') {
    return res.status(403).json({ 
      error: 'Only administrators can create Admin or Manager accounts.' 
    });
  }
  
  next();
};



