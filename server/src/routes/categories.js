import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.js';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, requirePermission('category:create'), validateRequest(createCategorySchema), createCategory);
router.patch('/:id', authenticate, requirePermission('category:update'), validateRequest(updateCategorySchema), updateCategory);
router.delete('/:id', authenticate, requirePermission('category:delete'), deleteCategory);

export default router;
