import Coupon from '../models/Coupon.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    validFrom: { $lte: new Date() },
    validTo: { $gte: new Date() },
  });

  if (!coupon || (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)) {
    throw new AppError('Invalid or expired coupon', 400);
  }

  if (req.user) {
    const usage = coupon.usedBy?.find(
      (u) => u.user.toString() === req.user._id.toString(),
    );
    if (usage && usage.count >= coupon.perUserLimit) {
      throw new AppError('Coupon usage limit reached', 400);
    }
  }

  sendSuccess(res, { coupon: { code: coupon.code, discount: coupon.value, type: coupon.type, minOrderValue: coupon.minOrderValue, maxDiscount: coupon.maxDiscount } });
});

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  sendSuccess(res, { coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.validatedBody);
  sendSuccess(res, { coupon }, 'Coupon created', 201);
});
