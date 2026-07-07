import { Router } from 'express';
import {
  getCartItems, addToCart, updateCartItem, removeCartItem, mergeCart,
} from '../controllers/cartController.js';
import authenticate from '../middlewares/authenticate.js';

const router = Router();

router.get('/', getCartItems);
router.post('/items', addToCart);
router.patch('/items/:itemId', updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.post('/merge', authenticate, mergeCart);

export default router;
