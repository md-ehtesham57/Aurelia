import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import slugify from 'slugify';
import { calculateProductPrice, bulkCalculatePrices } from '../services/priceCalculator.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    category, metal, purity, occasion,
    priceMin, priceMax, sort, page = 1, limit = 12,
    search,
  } = req.query;

  const filter = { status: 'published' };

  if (category) {
    const cat = await Category.findOne({ slug: category }).select('_id');
    if (!cat) {
      return sendSuccess(res, { products: [], pagination: { page: 1, pages: 1, total: 0 } }, 'No products found');
    }
    filter.category = cat._id;
  }
  if (metal) filter['metal.type'] = metal;
  if (purity) filter['metal.purity'] = purity;
  if (occasion) filter.occasion = { $in: occasion.split(',') };

  if (priceMin || priceMax) {
    filter.$or = [];

    if (priceMin) filter.basePriceOverride = { $gte: Number(priceMin) };
    if (priceMax) {
      filter.basePriceOverride = {
        ...(filter.basePriceOverride || {}),
        $lte: Number(priceMax),
      };
    }
  }

  if (search) {
    filter.$text = { $search: search };
  }

  let sortOption = {};
  switch (sort) {
    case 'price_asc': sortOption = { 'basePriceOverride': 1 }; break;
    case 'price_desc': sortOption = { 'basePriceOverride': -1 }; break;
    case 'newest': sortOption = { createdAt: -1 }; break;
    case 'best_sellers': sortOption = { isBestSeller: -1, ratingCount: -1 }; break;
    default: sortOption = { createdAt: -1 };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  const priceBreakdowns = await bulkCalculatePrices(products);

  const productsWithPrice = products.map((product) => {
    const pd = priceBreakdowns.find((p) => p.productId.toString() === product._id.toString());
    const productObj = product.toObject();
    productObj.priceBreakdown = pd || {};
    return productObj;
  });

  sendSuccess(res, {
    products: productsWithPrice,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug')
    .populate({
      path: 'reviews',
      match: { status: 'approved' },
      populate: { path: 'user', select: 'name' },
    });

  if (!product || product.status !== 'published') {
    throw new AppError('Product not found', 404);
  }

  const priceBreakdown = await calculateProductPrice(product);
  const productObj = product.toObject();
  productObj.priceBreakdown = priceBreakdown;

  sendSuccess(res, { product: productObj });
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = req.validatedBody;
  const slug = slugify(data.title, { lower: true, strict: true });

  const product = await Product.create({
    ...data,
    slug,
    createdBy: req.user._id,
  });

  sendSuccess(res, { product }, 'Product created', 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = req.validatedBody;
  if (data.title) {
    data.slug = slugify(data.title, { lower: true, strict: true });
  }
  data.updatedBy = req.user._id;

  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new AppError('Product not found', 404);

  sendSuccess(res, { product }, 'Product updated');
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status, updatedBy: req.user._id },
    { new: true },
  );

  if (!product) throw new AppError('Product not found', 404);

  sendSuccess(res, { product }, `Product ${status}`);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found', 404);

  sendSuccess(res, null, 'Product deleted');
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  const priceBreakdowns = await bulkCalculatePrices(products);

  const productsWithPrice = products.map((product) => {
    const pd = priceBreakdowns.find((p) => p.productId.toString() === product._id.toString());
    const productObj = product.toObject();
    productObj.priceBreakdown = pd || {};
    return productObj;
  });

  sendSuccess(res, {
    products: productsWithPrice,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});
