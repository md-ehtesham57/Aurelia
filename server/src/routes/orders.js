import { Router } from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, requestReturn,
} from '../controllers/orderController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';
import validateRequest from '../middlewares/validateRequest.js';
import validateObjectId from '../middlewares/validateObjectId.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.js';

const router = Router();

router.post('/', authenticate, validateRequest(createOrderSchema), createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/admin', authenticate, requirePermission('order:read'), getAllOrders);
router.get('/:id', authenticate, validateObjectId('id'), getOrderById);
router.patch('/:id/status', authenticate, requirePermission('order:update_status'), validateObjectId('id'), validateRequest(updateOrderStatusSchema), updateOrderStatus);
router.post('/:id/return-request', authenticate, validateObjectId('id'), requestReturn);

export default router;
