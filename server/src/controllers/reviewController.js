import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createReview = asyncHandler(async (req, res) => {
  const { product: productId, rating, title, comment } = req.body;

  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    status: 'delivered',
  });

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
    status: hasPurchased ? 'approved' : 'pending',
  });

  const stats = await Review.aggregate([
    { $match: { product: review.product, status: 'approved' } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length) {
    await Product.findByIdAndUpdate(productId, {
      ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
      ratingCount: stats[0].count,
    });
  }

  sendSuccess(res, { review }, 'Review submitted', 201);
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
    status: 'approved',
  }).populate('user', 'name');

  sendSuccess(res, { reviews });
});

export const moderateReview = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );

  if (!review) throw new AppError('Review not found', 404);
  sendSuccess(res, { review }, `Review ${status}`);
});
