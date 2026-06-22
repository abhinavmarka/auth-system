import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345!@#$');

      // Get user from database (exclude password_hash)
      const userResult = await pool.query(
        'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = userResult.rows[0];
      next();
    } catch (error) {
      console.error('Authorization error:', error.message);
      res.status(401);
      
      if (error.name === 'TokenExpiredError') {
        throw new Error('Not authorized, token has expired');
      } else {
        throw new Error('Not authorized, invalid token');
      }
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Administrator privileges required.');
  }
};
