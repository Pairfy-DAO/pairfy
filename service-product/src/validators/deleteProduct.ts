import { productIdSchema } from "@pairfy/common";
import { z } from "zod";

export const verifyParams = z.object({
  id: productIdSchema
});