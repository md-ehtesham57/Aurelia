import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const softAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).populate('role');
      if (user && !user.isBanned) {
        req.user = user;
      }
    }
  } catch {
    // silently continue as guest
  }
  next();
};

export default softAuth;
