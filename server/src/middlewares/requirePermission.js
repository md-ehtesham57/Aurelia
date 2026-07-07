import { sendError } from '../utils/apiResponse.js';

const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 'Authentication required.', 401);
    }

    const userPermissions = req.user.role.permissions || [];

    const hasPermission = permissions.some((perm) => userPermissions.includes(perm));
    if (!hasPermission) {
      return sendError(res, 'Insufficient permissions.', 403);
    }

    next();
  };
};

export default requirePermission;
