import { Router } from 'express';
import {
  getCartItems, addToCart, updateCartItem, removeCartItem, mergeCart,
} from '../controllers/cartController.js';
import authenticate from '../middlewares/authenticate.js';
import softAuth from '../middlewares/softAuth.js';
import validateObjectId from '../middlewares/validateObjectId.js';

const router = Router();

router.get('/', softAuth, getCartItems);
router.post('/items', softAuth, addToCart);
router.patch('/items/:itemId', softAuth, validateObjectId('itemId'), updateCartItem);
router.delete('/items/:itemId', softAuth, validateObjectId('itemId'), removeCartItem);
router.post('/merge', authenticate, mergeCart);

export default router;
