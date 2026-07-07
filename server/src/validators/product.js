import { z } from 'zod';

const imageSchema = z.object({
  url: z.string(),
  publicId: z.string().optional(),
  altText: z.string().optional(),
  order: z.number().optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(2).max(200),
  sku: z.string().min(1).max(50),
  description: z.string().optional(),
  shortDescription: z.string().max(300).optional(),
  category: z.string().optional(),
  collectionTags: z.array(z.string()).optional(),
  images: z.array(imageSchema).optional(),
  metal: z.object({
    type: z.enum(['gold', 'silver', 'platinum']).optional(),
    purity: z.string().optional(),
    color: z.enum(['yellow', 'rose', 'white']).optional(),
  }).optional(),
  weightGrams: z.number().positive().optional(),
  makingChargeType: z.enum(['flat', 'percentage']).optional(),
  makingChargeValue: z.number().optional(),
  basePriceOverride: z.number().optional(),
  gender: z.enum(['women', 'men', 'kids', 'unisex']).optional(),
  occasion: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'hidden', 'out_of_stock', 'archived']).optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  seo: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
  }).optional(),
});

export const updateProductSchema = createProductSchema.partial();
