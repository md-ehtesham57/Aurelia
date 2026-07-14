import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { bulkCalculatePrices } from '../services/priceCalculator.js';

const MAX_CART_QTY = 99;

const getCart = (userId, sessionId) => {
  if (userId) {
    return Cart.findOne({ user: userId });
  }
  if (sessionId) {
    return Cart.findOne({ sessionId })
  }
  return null;
};

const attachPrices = async (cart) => {
  if (!cart || !cart.items.length) return cart;
  const products = cart.items
    .filter((i) => i.product)
    .map((i) => i.product);
  const priceBreakdowns = await bulkCalculatePrices(products);
  const cartObj = cart.toObject();
  let subtotal = 0;
  cartObj.items = cartObj.items.map((item) => {
    const pid = item.product?._id?.toString() || item.product?.toString();
    const pd = priceBreakdowns.find((p) => p.productId.toString() === pid);
    const computedPrice = pd?.total || 0;
    subtotal += computedPrice * item.qty;
    return { ...item, computedPrice };
  });
  cartObj.subtotal = subtotal;
  return cartObj;
};

export const getCartItems = asyncHandler(async (req, res) => {
  let cart = await getCart(req.user?._id, req.cookies?.sessionId)
    .populate('items.product');

  const result = await attachPrices(cart);
  sendSuccess(res, { cart: result || { items: [], subtotal: 0 } });
});

const validateQty = (qty) => {
  const n = Number(qty);
  if (!Number.isInteger(n) || n < 1 || n > MAX_CART_QTY) {
    throw new AppError(`Quantity must be an integer between 1 and ${MAX_CART_QTY}`, 400);
  }
  return n;
};

export const addToCart = asyncHandler(async (req, res) => {
  const { product: productId, variantSku, qty = 1 } = req.body;
  const validQty = validateQty(qty);

  const product = await Product.findById(productId);
  if (!product || product.status !== 'published') {
    throw new AppError('Product not found', 404);
  }

  if (variantSku) {
    const variant = product.variants.find((v) => v.sku === variantSku);
    if (!variant) {
      throw new AppError('Variant not found', 404);
    }
  }

  const userId = req.user?._id;
  const sessionId = req.cookies?.sessionId || crypto.randomUUID();

  if (!req.user) {
    res.cookie('sessionId', sessionId, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  let cart = await getCart(userId, sessionId);

  if (!cart) {
    cart = await Cart.create({
      user: userId || undefined,
      sessionId: userId ? undefined : sessionId,
      items: [],
    });
  }

  const existingItem = cart.items.find((i) => {
    // Extract the raw hexadecimal string cleanly
    const itemProductId = i.product?._id ? i.product._id.toString() : i.product.toString();
    return itemProductId === productId && i.variantSku === (variantSku || undefined);
  });

  if (existingItem) {
    const newQty = existingItem.qty + validQty;
    if (newQty > MAX_CART_QTY) {
      throw new AppError(`Maximum quantity per item is ${MAX_CART_QTY}`, 400);
    }
    existingItem.qty = newQty;
  } else {
    cart.items.push({ product: productId, variantSku, qty: validQty });
  }

  await cart.save();

  await cart.populate('items.product');
  const cartWithPrices = await attachPrices(cart);

  sendSuccess(res, { cart: cartWithPrices }, 'Item added to cart');
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { qty } = req.body;

  const userId = req.user?._id;
  const sessionId = req.cookies?.sessionId;

  const cart = await getCart(userId, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.items.id(itemId);
  if (!item) throw new AppError('Item not found in cart', 404);

  const n = Number(qty);
  if (!Number.isInteger(n) || n < 0) {
    throw new AppError('Quantity must be a positive integer', 400);
  }

  if (n === 0) {
    cart.items.pull({ _id: itemId });
  } else {
    if (n > MAX_CART_QTY) {
      throw new AppError(`Maximum quantity per item is ${MAX_CART_QTY}`, 400);
    }
    item.qty = n;
  }

  await cart.save();
  await cart.populate('items.product');
  const updatedCart = await attachPrices(cart);

  sendSuccess(res, { cart: updatedCart }, 'Cart updated');
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const userId = req.user?._id;
  const sessionId = req.cookies?.sessionId;

  const cart = await getCart(userId, sessionId);
  if (!cart) throw new AppError('Cart not found', 404);

  cart.items.pull({ _id: itemId });
  await cart.save();
  await cart.populate('items.product');
  const updatedCart = await attachPrices(cart);

  sendSuccess(res, { cart: updatedCart }, 'Item removed from cart');
});

export const mergeCart = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const userId = req.user._id;

  const guestCart = await Cart.findOne({ sessionId });
  if (!guestCart || !guestCart.items.length) {
    sendSuccess(res, null, 'Nothing to merge');
    return;
  }

  let userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    userCart = await Cart.create({ user: userId, items: [] });
  }

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (i) => i.product.toString() === guestItem.product.toString()
        && i.variantSku === guestItem.variantSku,
    );
    if (existing) {
      existing.qty += guestItem.qty;
    } else {
      userCart.items.push(guestItem);
    }
  }

  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });

  sendSuccess(res, null, 'Cart merged');
});
