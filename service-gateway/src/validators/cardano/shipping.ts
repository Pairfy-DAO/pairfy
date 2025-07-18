import { z } from "zod";

const hexRegex = /^[a-fA-F0-9]+$/;
const base64Regex = /^[A-Za-z0-9+/=]+$/;

export const shippingEndpoinSchema = z.strictObject({
    order_id: z.string()
    .min(1)
    .max(100)
    .regex(hexRegex, { message: "order_id must be a hexadecimal string" }),

  date: z.number()
    .int()
    .nonnegative()
    .refine(val => val.toString().length >= 13, {
      message: "date must be a Unix timestamp in milliseconds (13 digits)",
    }),

  metadata: z.string()
    .min(1)
    .max(344)
    .regex(base64Regex, { message: "metadata must be a valid base64 string" }),
});
