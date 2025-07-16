import z from "zod";

export const orderIdSchema = z
  .string()
  .min(1, { message: "Order ID cannot be empty" })
  .max(100, { message: "Order ID cannot be longer than 100 characters" })
  .regex(/^[a-fA-F0-9]+$/, {
    message: "Must contain only hexadecimal characters",
  });