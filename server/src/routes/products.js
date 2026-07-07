import { Router } from 'express';
import {
  getProducts, getProductBySlug, createProduct,
  updateProduct, updateProductStatus, deleteProduct, getAdminProducts,
} from '../controllers/productController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';
import validateRequest from '../middlewares/validateRequest.js';
import { createProductSchema, updateProductSchema } from '../validators/product.js';

const router = Router();

router.get('/', getProducts);
router.get('/admin', authenticate, requirePermission('product:read'), getAdminProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, requirePermission('product:create'), validateRequest(createProductSchema), createProduct);
router.patch('/:id', authenticate, requirePermission('product:update'), validateRequest(updateProductSchema), updateProduct);
router.patch('/:id/status', authenticate, requirePermission('product:publish'), updateProductStatus);
router.delete('/:id', authenticate, requirePermission('product:delete'), deleteProduct);

export default router;
