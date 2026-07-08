import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import AuditLog from '../models/AuditLog.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { calculateCartTotal } from '../services/priceCalculator.js';
import { createRazorpayOrder } from '../services/paymentService.js';
import { sendOrderConfirmation } from '../services/emailService.js';

const generateOrderNumber = () => {
  const prefix = 'AJ';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress, billingAddress,
    paymentMethod, couponCode, giftWrapping, giftMessage,
  } = req.validatedBody;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || !cart.items.length) {
    throw new AppError('Cart is empty', 400);
  }

  const products = cart.items.filter((i) => i.product).map((i) => i.product);
  const items = cart.items.map((i) => ({
    product: i.product._id || i.product,
    variantSku: i.variantSku,
    qty: i.qty,
  }));

  const { calculatedItems, subtotal } = await calculateCartTotal(items, products);

  for (const item of calculatedItems) {
    const product = products.find((p) => p._id.toString() === item.product.toString());
    if (item.variantSku) {
      const variant = product.variants.find((v) => v.sku === item.variantSku);
      if (!variant || variant.stock < item.qty) {
        throw new AppError(`Insufficient stock for ${product.title}`, 400);
      }
    }
  }

  let discount = 0;
  let couponApplied = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validTo: { $gte: new Date() },
    });

    if (!coupon || (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)) {
      throw new AppError('Invalid or expired coupon', 400);
    }

    const usage = coupon.usedBy?.find(
      (u) => u.user.toString() === req.user._id.toString(),
    );
    if (usage && usage.count >= coupon.perUserLimit) {
      throw new AppError('Coupon usage limit reached', 400);
    }

    if (subtotal < coupon.minOrderValue) {
      throw new AppError(`Minimum order value of ₹${coupon.minOrderValue} required`, 400);
    }

    discount = coupon.type === 'flat'
      ? coupon.value
      : Math.round(subtotal * (coupon.value / 100));

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    coupon.usedCount += 1;
    if (usage) {
      usage.count += 1;
    } else {
      coupon.usedBy.push({ user: req.user._id, count: 1 });
    }
    await coupon.save();
    couponApplied = coupon._id;
  }

  const gstRate = 0.03;
  const taxableAmount = subtotal - discount;
  const gst = Math.round(taxableAmount * gstRate);
  const shippingFee = taxableAmount > 500 ? 0 : 50;
  const total = taxableAmount + gst + shippingFee;

  if (paymentMethod === 'cod' && total > 50000) {
    throw new AppError('COD not available for orders above ₹50,000', 400);
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items: calculatedItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    subtotal,
    discount,
    gst,
    shippingFee,
    total,
    couponApplied,
    giftWrapping,
    giftMessage,
    statusHistory: [{ status: 'placed', note: 'Order placed' }],
  });

  let paymentOrder = null;
  if (paymentMethod === 'razorpay') {
    paymentOrder = await createRazorpayOrder(total);
    order.paymentTransactionId = paymentOrder.id;
    await order.save();
  }

  for (const item of calculatedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { 'variants.$[elem].stock': -item.qty },
      arrayFilters: [{ 'elem.sku': item.variantSku }],
    });
  }

  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $set: { items: [] } },
  );

  sendOrderConfirmation(order, req.user).catch(() => {});

  sendSuccess(res, { order, paymentOrder }, 'Order created', 201);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  sendSuccess(res, { orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'title images slug');

  if (!order) throw new AppError('Order not found', 404);

  if (order.user.toString() !== req.user._id.toString()
    && !req.user.role.permissions.includes('order:read')) {
    throw new AppError('Not authorized', 403);
  }

  sendSuccess(res, { order });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  sendSuccess(res, {
    orders,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.validatedBody;

  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  order.status = status;
  order.statusHistory.push({ status, note: note || `Status changed to ${status}` });
  await order.save();

  await AuditLog.create({
    actor: req.user._id,
    action: `order:update_status`,
    resourceType: 'Order',
    resourceId: order._id,
    changes: { status },
  });

  sendSuccess(res, { order }, 'Order status updated');
});

export const requestReturn = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError('Order not found', 404);

  if (order.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  if (order.status !== 'delivered') {
    throw new AppError('Only delivered orders can be returned', 400);
  }

  order.status = 'return_requested';
  order.statusHistory.push({ status: 'return_requested', note: req.body.reason || 'Return requested' });
  await order.save();

  sendSuccess(res, { order }, 'Return requested');
});
