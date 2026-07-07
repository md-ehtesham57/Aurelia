import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  image: z.string().optional(),
  parentCategory: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
  filterFacets: z.array(z.string()).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
