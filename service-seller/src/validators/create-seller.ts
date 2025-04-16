import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const emailRegex =
  /^(?=.{1,254}$)[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/;

const usernameRegex = /^[a-zA-Z0-9]*$/;

const registrationSchema = z.object({
  email: z.string().email("Invalid email format").regex(emailRegex, {
    message: "Invalid email format (OWASP-compliant)",
  }),

  username: z
    .string()
    .min(5, "Username must be at least 5 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(usernameRegex, "Only letters and numbers are allowed."),

  password: z.string().regex(passwordRegex, {
    message:
      "Password must be 8–64 characters and include lowercase, uppercase, number, and special character",
  }),

  terms_accepted: z.literal(true).refine((val) => val === true, {
    message: "Terms must be accepted",
  }),

  country: z
    .string()
    .length(2, "Country must be a valid ISO 3166-1 alpha-2 code")
    .toUpperCase()
    .refine((val) => val === "US", {
      message: "Country must be 'US'",
    }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const validateParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = registrationSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({ errors });
  }

  // Optionally attach validated data to request object
  req.body = result.data;
  next();
};
