import { z } from 'zod';

export const verifyParams = z.object({
    id: z.string().max(100),
    keeping_stock: z.number().int().min(0).max(999999),
    ready_stock: z.number().int().min(0).max(999999),
    purchase_limit: z.boolean(),
    purchase_limit_value: z.number().int().min(0).max(999999),
    stop_purchases: z.boolean()
  }).strict();