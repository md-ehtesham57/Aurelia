import { Router } from 'express';
import { createReview, getProductReviews, getAllReviews, moderateReview } from '../controllers/reviewController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/', authenticate, requirePermission('content:read'), getAllReviews);
router.get('/product/:productId', getProductReviews);
router.patch('/:id/moderate', authenticate, requirePermission('content:moderate'), moderateReview);

export default router;
