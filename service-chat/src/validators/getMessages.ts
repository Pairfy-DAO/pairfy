import { z } from 'zod';
import { sessionSchema } from './index.js';

export const getMessagesSchema = z.object({
  session: sessionSchema
}).strict()