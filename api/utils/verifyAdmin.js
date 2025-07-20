import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, 'Access denied. No token provided.'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify token's payload matches admin credentials
    if (
      decoded.email !== process.env.ADMIN_EMAIL ||
      decoded.password !== process.env.ADMIN_PASSWORD
    ) {
      return next(errorHandler(403, 'Access denied. Admins only.'));
    }

    req.user = decoded;
    next();
  } catch (err) {
    return next(errorHandler(401, 'Invalid or expired token.'));
  }
};
