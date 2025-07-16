import { z } from "zod";
import { orderIdSchema } from "../index.js";

export const canceledEndpointSchema = z.strictObject({
    order_id: orderIdSchema
  });