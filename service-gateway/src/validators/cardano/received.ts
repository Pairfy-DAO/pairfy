import { z } from "zod";
import { orderIdSchema } from "../index.js";

export const receivedEndpointSchema = z.strictObject({
    order_id: orderIdSchema
  });