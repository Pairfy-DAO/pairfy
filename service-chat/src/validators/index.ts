import { z } from "zod";

export const sessionSchema = z
  .string()
  .min(100, { message: "Must be at least 100 characters long." })
  .max(250, { message: "Must not exceed 250 characters." })
  .refine((val) => (val.match(/:/g) || []).length === 2, {
    message: "Must contain exactly two ':' characters.",
  });

export const owaspSafeRegex = /^[a-zA-Z0-9\s!@#$%^&*()_\+\-=\[\]{}|\\:'",.\/?]*$/;
