import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    role: z.union([z.literal('worker'), z.literal('employer')]),
  }).passthrough(),
});
