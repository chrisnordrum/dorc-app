import { z } from "zod";

// A MongoDB ObjectId as it appears in JSON: 24 hex characters. Stricter than
// mongoose.Types.ObjectId.isValid, which also accepts any 12-character string.
export const objectIdSchema = z.string().regex(/^[0-9a-f]{24}$/i, "Invalid id");

// Mongoose `timestamps` serialize as ISO 8601 strings, e.g. "2026-09-25T18:04:11.512Z".
export const timestampSchema = z.iso.datetime();

export const messageResponseSchema = z.object({ message: z.string() });
export type MessageResponse = z.infer<typeof messageResponseSchema>;

// The server has three error conventions today: `{ message }` from the auth
// controllers, `{ error }` from the quest/badge/rank controllers, and `{ errors }`
// from express-validator. 2.7 should collapse them into one; until then, a client
// reading an error body has to handle all three.
export const errorResponseSchema = z.union([
  z.object({ message: z.string() }),
  z.object({ error: z.string() }),
  z.object({
    errors: z.array(z.looseObject({ msg: z.string(), path: z.string().optional() })),
  }),
]);
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
