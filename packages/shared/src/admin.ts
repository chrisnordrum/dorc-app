import { z } from "zod";
import { objectIdSchema, timestampSchema } from "./common.ts";
import { roleSchema } from "./auth.ts";

// GET /api/admin/users returns raw User documents minus `password`. That means
// `email` and `bio` arrive as AES ciphertext with their IVs alongside, not as
// readable values. Recorded as-is; 8.5 should replace it with a real projection.
export const adminUserSchema = z.object({
  _id: objectIdSchema,
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  email_iv: z.string(),
  bio: z.string().nullable(),
  bio_iv: z.string().nullable(),
  role: roleSchema,
  googleId: z.string().nullable(),
  authProvider: z.enum(["local", "google"]),
  // Absent on accounts created before these fields were added to the schema.
  timezone: z.string().optional(),
  createdAt: timestampSchema.optional(),
  updatedAt: timestampSchema.optional(),
  __v: z.number(),
});
export type AdminUser = z.infer<typeof adminUserSchema>;

export const adminUsersResponseSchema = z.array(adminUserSchema);
export type AdminUsersResponse = z.infer<typeof adminUsersResponseSchema>;

// GET /api/admin returns `{ message }` — use messageResponseSchema from common.ts.
