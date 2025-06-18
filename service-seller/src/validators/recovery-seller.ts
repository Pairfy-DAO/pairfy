import { z } from "zod";
import { emailRegex } from "./index.js";

export const verifyParams = z.object({
  email: z.string().email("Invalid email format").regex(emailRegex, {
    message: "Invalid email format",
  })
});