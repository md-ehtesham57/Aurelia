import { Router } from 'express';
import { applyCoupon, getCoupons, createCoupon } from '../controllers/couponController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';

const router = Router();

router.post('/apply', applyCoupon);
router.get('/', authenticate, requirePermission('discount:create'), getCoupons);
router.post('/', authenticate, requirePermission('discount:create'), createCoupon);

export default router;
