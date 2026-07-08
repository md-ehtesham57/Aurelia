import Banner from '../models/Banner.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getBanners = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.all !== 'true') filter.isActive = true;
  const banners = await Banner.find(filter).sort({ sortOrder: 1 });
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
