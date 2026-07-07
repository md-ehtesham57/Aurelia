import { Router } from 'express';
import { getRoles, createRole, updateRolePermissions } from '../controllers/roleController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';

const router = Router();

router.get('/', authenticate, requirePermission('role:create'), getRoles);
router.post('/', authenticate, requirePermission('role:create'), createRole);
router.patch('/:id/permissions', authenticate, requirePermission('role:assign_permission'), updateRolePermissions);

export default router;
