import GoldRateConfig from '../models/GoldRateConfig.js';
import { sendSuccess } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getGoldRates = asyncHandler(async (_req, res) => {
  const rates = await GoldRateConfig.find()
    .sort({ effectiveDate: -1 })
    .limit(10);

  sendSuccess(res, { rates });
});

export const updateGoldRate = asyncHandler(async (req, res) => {
  const { metalType, purity, ratePerGram } = req.body;

  const rate = await GoldRateConfig.create({
    metalType,
    purity,
    ratePerGram,
    updatedBy: req.user._id,
  });

  sendSuccess(res, { rate }, 'Gold rate updated', 201);
});
