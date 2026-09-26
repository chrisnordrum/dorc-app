import { z } from "zod";

// Badges, ranks and daily quotes as served today from server/data/data.json.
// These shapes change when 3.2 seeds them into MongoDB (ObjectId ids) and when
// 7.1 turns ranks into a leaderboard aggregation — which is the point of writing
// them down: that change becomes a type error wherever they're consumed.

// GET /api/badges — one entry per badge. Each has exactly one criterion today,
// but nothing evaluates them yet (5.2).
export const badgeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  alt: z.string(),
  criteria: z.object({
    questsCompleted: z.number().optional(),
    streakDays: z.number().optional(),
    questsByCategory: z.record(z.string(), z.number()).optional(),
    longQuestMinutes: z.number().optional(),
  }),
});
export type Badge = z.infer<typeof badgeSchema>;

// GET /api/ranks (authenticated). Note there's no `id`: Leaderboard.jsx keys
// its rows on `rank.id`, which is undefined for every row.
export const rankSchema = z.object({
  userId: z.number(),
  name: z.string(),
  level: z.number(),
  xp: z.number(),
  position: z.number(),
});
export type Rank = z.infer<typeof rankSchema>;

// GET /api/dailyQuotes
export const dailyQuoteSchema = z.object({
  id: z.number(),
  quote: z.string(),
  author: z.string(),
});
export type DailyQuote = z.infer<typeof dailyQuoteSchema>;
