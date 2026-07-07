import { Router } from 'express';
import { getBanners, createBanner, updateBanner } from '../controllers/bannerController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';

const router = Router();

router.get('/', getBanners);
router.post('/', authenticate, requirePermission('banner:create'), createBanner);
router.patch('/:id', authenticate, requirePermission('banner:update'), updateBanner);

export default router;
