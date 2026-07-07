import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, requirePermission('category:create'), createCategory);
router.patch('/:id', authenticate, requirePermission('category:update'), updateCategory);
router.delete('/:id', authenticate, requirePermission('category:delete'), deleteCategory);

export default router;
