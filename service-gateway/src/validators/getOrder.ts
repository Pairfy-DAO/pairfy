import { z } from "zod";

export const getOrderSchema = z.object({
    id: z.string()
      .min(1, { message: "Order ID cannot be empty" })
      .max(100, { message: "Order ID cannot be longer than 100 characters" })
  });