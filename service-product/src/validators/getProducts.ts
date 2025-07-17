import { z } from "zod";

const cursorSchema = z.string()
  .min(1, { message: "String must be at least 1 character long" })
  .max(113, { message: "String must be at most 113 characters long" })
  .regex(/^[a-zA-Z0-9\-_]+$/, { message: "Only alphanumeric characters, '-' and '_' are allowed" });

export const getProductsSchema = z.object({
  cursor: cursorSchema.optional(),

  reverseCursor: cursorSchema.optional(),
})
.refine((data) => !(data.cursor && data.reverseCursor), {
  message: "Cannot use both cursor and reverseCursor",
  path: ["cursor"],
});
