import { z } from "zod";
import { orderIdSchema } from "../index.js";

export const lockingEndpointSchema = z.strictObject({
    order_id: orderIdSchema
  });