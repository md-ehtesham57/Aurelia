import { Router } from 'express';
import {
  getMe, updateMe, addToWishlist,
  getUsers, updateUserRole, banUser,
} from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';

const router = Router();

router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);
router.post('/wishlist', authenticate, addToWishlist);
router.get('/', authenticate, requirePermission('user:read'), getUsers);
router.patch('/:id/role', authenticate, requirePermission('user:update_role'), updateUserRole);
router.patch('/:id/ban', authenticate, requirePermission('user:ban'), banUser);

export default router;
