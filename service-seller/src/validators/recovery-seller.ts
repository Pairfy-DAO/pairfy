import { z } from "zod";
import { emailSchema } from "@pairfy/common";

export const recoverySellerSchema = z.object({
  email: emailSchema
});