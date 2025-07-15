import { z } from "zod";
import { orderIdSchema } from "../index.js";

export const returnedEndpointSchema = z.strictObject({
    order_id: orderIdSchema
  });