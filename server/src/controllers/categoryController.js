import Category from '../models/Category.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import slugify from 'slugify';

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true })
    .populate('parentCategory', 'name slug')
    .sort({ sortOrder: 1 });

  sendSuccess(res, { categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const data = req.validatedBody;
  data.slug = slugify(data.name, { lower: true, strict: true });

  const category = await Category.create(data);
  sendSuccess(res, { category }, 'Category created', 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const data = req.validatedBody;
  if (data.name) {
    data.slug = slugify(data.name, { lower: true, strict: true });
  }

  const category = await Category.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!category) throw new AppError('Category not found', 404);
  sendSuccess(res, { category }, 'Category updated');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new AppError('Category not found', 404);

  await Category.updateMany(
    { parentCategory: req.params.id },
    { parentCategory: null },
  );

  sendSuccess(res, null, 'Category deleted');
});
