import { z } from 'zod';

const schema = z.object({

  signature: z.object({
    key: z.string()
      .regex(/^[a-f0-9]+$/i, 'Key must be a hex string')
      .min(64, 'Key too short')
      .max(512, 'Key too long'),
    signature: z.string()
      .regex(/^[a-f0-9]+$/i, 'Signature must be a hex string')
      .min(64, 'Signature too short')
      .max(2048, 'Signature too long')
  }),

  address: z.string()
    .regex(/^[a-f0-9]+$/i, 'Address must be a hex string')
    .min(64, 'Address too short')
    .max(512, 'Address too long'),

  terms_accepted: z.literal(true),

  country: z.string()
  .length(2, 'Country must be a 2-letter ISO code')
  .regex(/^[A-Z]{2}$/, 'Country must be uppercase 2-letter ISO code')

}).strict();


