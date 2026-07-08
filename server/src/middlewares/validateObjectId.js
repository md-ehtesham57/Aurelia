import mongoose from 'mongoose';
import { sendError } from '../utils/apiResponse.js';

const validateObjectId = (...paramNames) => {
  return (req, res, next) => {
    for (const name of paramNames) {
      const val = req.params[name];
      if (val && !mongoose.Types.ObjectId.isValid(val)) {
        return sendError(res, `Invalid ${name}`, 400);
      }
    }
    next();
  };
};

export default validateObjectId;
