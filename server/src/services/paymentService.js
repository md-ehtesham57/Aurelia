import crypto from 'crypto';
import { getRazorpay } from '../config/razorpay.js';
import logger from '../utils/logger.js';

export const createRazorpayOrder = async (amount, currency = 'INR') => {
  const razorpay = getRazorpay();
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    });
    return order;
  } catch (error) {
    logger.error('Razorpay order creation failed:', error);
    throw error;
  }
};

export const verifyRazorpayPayment = (orderId, paymentId, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expectedSignature === signature;
};

export const processRefund = async (paymentId, amount) => {
  const razorpay = getRazorpay();
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100,
    });
    return refund;
  } catch (error) {
    logger.error('Refund failed:', error);
    throw error;
  }
};
