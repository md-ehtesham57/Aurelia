import Coupon from '../models/Coupon.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validTo: { $gte: new Date() },
  });

  if (!coupon || (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)) {
    throw new AppError('Invalid or expired coupon', 400);
  }

  if (orderValue < coupon.minOrderValue) {
    throw new AppError(`Minimum order value of ₹${coupon.minOrderValue} required`, 400);
  }

  let discount = coupon.type === 'flat'
    ? coupon.value
    : Math.round(orderValue * (coupon.value / 100));

  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  sendSuccess(res, { coupon: { code: coupon.code, discount, type: coupon.type } });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  sendSuccess(res, { coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.validatedBody);
  sendSuccess(res, { coupon }, 'Coupon created', 201);
});
