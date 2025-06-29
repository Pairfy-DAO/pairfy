import { z } from "zod";

export const getBookSchema = z.object({
    id: z.string()
      .min(1, { message: "Book ID cannot be empty" })
      .max(100, { message: "Book ID cannot be longer than 100 characters" })
  });