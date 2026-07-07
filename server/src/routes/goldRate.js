import { Router } from 'express';
import { getGoldRates, updateGoldRate } from '../controllers/goldRateController.js';
import authenticate from '../middlewares/authenticate.js';
import requirePermission from '../middlewares/requirePermission.js';

const router = Router();

router.get('/', getGoldRates);
router.patch('/', authenticate, requirePermission('product:update'), updateGoldRate);

export default router;
