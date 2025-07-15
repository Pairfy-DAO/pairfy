import { z } from "zod";
import { orderIdSchema } from "../index.js";

export const appealedEndpointSchema = z.strictObject({
    order_id: orderIdSchema
  });