import { z } from "zod";
import { objectIdSchema, timestampSchema } from "./common.ts";

// The MongoDB-backed quest contract (server/models/Quest.js), which PATCH and
// DELETE already speak. GET and POST /api/quests still read and write data.json,
// whose quests have a numeric `id` and a `completed` flag; those two routes move
// onto this contract in Phase 3, and data.json goes away in 3.2.

// Limits mirror the Mongoose schema so a request that passes here can't then
// fail validation at the database.
const titleSchema = z.string().trim().min(1, "Title is required").max(100);
const descriptionSchema = z.string().trim().max(500);
const xpRewardSchema = z.number().int().min(1).max(1000);

export const questSchema = z.object({
  id: objectIdSchema,
  userId: objectIdSchema,
  title: z.string(),
  description: z.string(),
  xpReward: z.number(),
  // false once soft-deleted; completions still reference it.
  active: z.boolean(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});
export type Quest = z.infer<typeof questSchema>;

// Route params for /api/quests/:id
export const questParamsSchema = z.object({ id: objectIdSchema });
export type QuestParams = z.infer<typeof questParamsSchema>;

// POST /api/quests. The owner comes from the access token, never the body.
export const createQuestRequestSchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  xpReward: xpRewardSchema,
});
export type CreateQuestRequest = z.infer<typeof createQuestRequestSchema>;

// PATCH /api/quests/:id — same fields as ALLOWED_UPDATE_FIELDS in
// questsController.js. Unknown keys (userId included) are stripped, which is
// what stops a payload reassigning a quest to someone else.
export const updateQuestRequestSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    xpReward: xpRewardSchema,
    active: z.boolean(),
  })
  .partial()
  .refine(
    (body) => Object.keys(body).length > 0,
    "No updatable fields provided",
  );
export type UpdateQuestRequest = z.infer<typeof updateQuestRequestSchema>;

// 200 from DELETE /api/quests/:id
export const deleteQuestResponseSchema = z.object({
  message: z.string(),
  id: objectIdSchema,
});
export type DeleteQuestResponse = z.infer<typeof deleteQuestResponseSchema>;
