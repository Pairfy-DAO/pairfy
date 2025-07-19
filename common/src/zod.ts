import { z } from "zod";

export const emailRegex =
  /^[^'"`\\\x00@\s]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

export const passwordRegex = /^.{12,64}$/;

export const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/;

export const hexRegex = /^(0x)?[a-fA-F0-9]+$/;

export const emailSchema = z
  .string()
  .max(254, "The email must not exceed 254 characters.")
  .regex(emailRegex, "Enter a valid email (example@domain.com).")
  .refine(
    (email) => {
      const [local] = email.split("@");
      return local && local.length <= 63;
    },
    { message: "The part before @ must not exceed 63 characters." }
  );

export const passwordSchema = z
  .string()
  .min(12, "Must be at least 12 characters long.")
  .max(64, "Must not exceed 64 characters.")
  .regex(passwordRegex, "Invalid password.");

export const usernameSchema = z.string().regex(usernameRegex, {
  message:
    "Username must be 3–32 characters and use only letters, numbers, or underscores.",
});
