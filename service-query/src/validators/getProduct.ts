import { z } from "zod";

export const getProductSchema = z.object({
    id: z.string()
      .min(1, { message: "Product ID cannot be empty" })
      .max(100, { message: "Product ID cannot be longer than 100 characters" })
  });