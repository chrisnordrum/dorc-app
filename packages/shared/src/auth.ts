import { z } from "zod";
import { objectIdSchema } from "./common.ts";

// Field rules shared by every request that carries them. These are the rules the
// server will enforce once 2.7 replaces express-validator with these schemas; until
// then the server still runs validator/user.js, and nothing here is wired in.

// Matches the client's existing check (utils/validators.js). The server doesn't
// enforce a username format today.
const usernameSchema = z
  .string()
  .regex(
    /^[a-z0-9_]{3,20}$/,
    "Username must be 3–20 characters: lowercase letters, numbers or underscores",
  );

// 2.8 raises this to 12.
const newPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");

// No character-set restriction on purpose: the client's regex only admits Latin
// letters, which is a UX choice, not a contract the server should hold people to.
const nameSchema = z.string().trim().min(1, "Required").max(50);

// Trim and lowercase *before* validating: `z.email().trim()` checks the format
// first and so rejects " Foo@Example.com ".
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email("Invalid email"));

const bioSchema = z.string().trim().max(280);

// --- Requests ------------------------------------------------------------------

// POST /api/auth/register
export const registerRequestSchema = z.object({
  username: usernameSchema,
  password: newPasswordSchema,
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

// POST /api/auth/login
// Deliberately not the register rules: if the username format or password
// minimum tightens (2.8), existing accounts must still be able to log in.
export const loginRequestSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

// PATCH /api/auth/modify-profile
// `bio` is optional in validator/user.js, but authController.modifyProfile
// encrypts it unconditionally and 500s without it — so it is required in practice.
export const modifyProfileRequestSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
  bio: bioSchema,
});
export type ModifyProfileRequest = z.infer<typeof modifyProfileRequestSchema>;

// --- Responses -----------------------------------------------------------------

export const roleSchema = z.enum(["user", "admin"]);
export type Role = z.infer<typeof roleSchema>;

// The signed-in user as the auth endpoints return it, email and bio decrypted.
export const authUserSchema = z.object({
  id: objectIdSchema,
  role: roleSchema,
  username: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  bio: z.string(),
});
export type AuthUser = z.infer<typeof authUserSchema>;

// 201 from POST /register, 200 from POST /login and GET /refresh.
export const authResponseSchema = z.object({
  message: z.string(),
  accessToken: z.string(),
  user: authUserSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

// 200 from PATCH /modify-profile. Omits `id` and `role` — the client merges it
// into the user it already holds rather than replacing it.
export const modifyProfileResponseSchema = z.object({
  message: z.string(),
  user: authUserSchema.omit({ id: true, role: true }),
});
export type ModifyProfileResponse = z.infer<typeof modifyProfileResponseSchema>;

// POST /api/auth/logout returns `{ message }`, or 204 with no body if there was
// no refresh cookie to clear. Use messageResponseSchema from common.ts.
