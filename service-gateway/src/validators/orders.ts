import { productIdSchema } from '@pairfy/common';
import { z } from 'zod';

export const pendingEndpointSchema = z.object({
  product_id: productIdSchema,
  order_units: z
    .number()
    .int({ message: 'Must be an integer' })
    .positive({ message: 'Must be a positive number' })
    .min(1, { message: 'Minimum allowed is 1' })
    .max(100, { message: 'Maximum allowed is 100' }),
});
