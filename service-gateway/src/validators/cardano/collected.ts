import { z } from "zod";
import { orderIdSchema } from "../index.js";

export const collectedEndpointSchema = z.strictObject({
    order_id: orderIdSchema
  });