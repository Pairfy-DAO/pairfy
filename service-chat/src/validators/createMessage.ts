import { z } from "zod";
import { owaspSafeRegex, sessionSchema } from './index.js';

export const createMessageSchema = z
  .object({
    session: sessionSchema,
    content: z
      .string()
      .min(1, { message: "Message cannot be empty." })
      .max(300, { message: "Message must not exceed 300 characters." })
      .regex(owaspSafeRegex, {
        message:
          "Message contains invalid characters. Only OWASP-safe symbols are allowed.",
      }),
  })
  .strict();
