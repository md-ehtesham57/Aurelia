import { z } from 'zod';

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    country: z.string().optional(),
  }),
  billingAddress: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    country: z.string().optional(),
  }).optional(),
  paymentMethod: z.enum(['razorpay', 'cod']),
  couponCode: z.string().optional(),
  giftWrapping: z.boolean().optional(),
  giftMessage: z.string().max(500).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'confirmed', 'packed', 'shipped', 'out_for_delivery',
    'delivered', 'cancelled', 'return_requested', 'returned', 'refunded',
  ]),
  note: z.string().optional(),
});
