import { z } from "zod";

const allowedCountries = ["US"] as const;

const countryEnum = z.enum(allowedCountries);

const hexRegex = /^[a-fA-F0-9]+$/;

const signatureSchema = z.object({
  key: z.string()
    .regex(hexRegex, { message: "Key must be a valid hexadecimal string" })
    .min(64, "Key is too short")
    .max(512, "Key is too long"),

  signature: z.string()
    .regex(hexRegex, { message: "Signature must be a valid hexadecimal string" })
    .min(64, "Signature is too short")
    .max(2048, "Signature is too long"),
}).strict(); 

export const verifyParams = z.object({
  signature: signatureSchema,

  address: z.string()
    .regex(hexRegex, { message: "Address must be a valid hexadecimal string" })
    .min(64, "Address is too short")
    .max(256, "Address is too long"),

  wallet_name: z.string()
    .min(2, "Wallet name is too short")
    .max(50, "Wallet name is too long")
    .regex(/^[a-zA-Z0-9_\-]+$/, {
      message: "Wallet name must contain only letters, numbers, hyphens, or underscores",
    }),

  country: countryEnum,

  terms_accepted: z.literal(true),
}).strict(); 