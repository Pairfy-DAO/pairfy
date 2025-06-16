import { z } from "zod";
import { passwordRegex } from "./index.js";

export const verifyParams = z.object({
  token: z
    .string()
    .min(100, { message: "JWT is too short" })
    .max(2000, { message: "JWT is too long" })
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
      message: "Invalid JWT format",
    }),

  password: z.string().regex(passwordRegex, {
    message:
      "Password must be 8–64 characters and include lowercase, uppercase, number, and special character",
  }),
});

export const verifyTokenType = z.object({
  source: z.literal("service-seller"),
  role: z.literal("SELLER"),
  email: z.string().email(),
  username: z.string(),
});
