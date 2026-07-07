import Banner from '../models/Banner.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getBanners = asyncHandler(async (_req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ sortOrder: 1 });
  sendSuccess(res, { banners });
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  sendSuccess(res, { banner }, 'Banner created', 201);
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!banner) throw new AppError('Banner not found', 404);
  sendSuccess(res, { banner }, 'Banner updated');
});
