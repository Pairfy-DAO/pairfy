import { z } from 'zod';

export const EditNotificationsSchema = z.object({
  ids: z
    .array(z.string().min(1, { message: "Each ID must be a non-empty string" }))
    .min(1, { message: "You must provide at least one ID" })
    .max(25, { message: "You cannot provide more than 25 IDs" }),
}).strict();
