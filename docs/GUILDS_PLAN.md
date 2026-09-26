# Guilds — Build Plan

Detailed plan for [ROADMAP](ROADMAP.md) Phase 6. The roadmap holds one checkbox per
`6.x` heading below; this file holds the per-commit steps. Check off a roadmap item when
every step under its heading here is checked. When 6.7 is done, delete this file and move
anything worth keeping out of **Decisions** into the roadmap first — 6.8 waits on 8.5 and
is already listed there.

---

## Goal

Friend groups create private guilds and define their own **trackers** — "hours in the
gym", "GitHub commits", "$ saved" — each with a unit, a weekly or monthly window, and a
title name like "Gym Bro of the Week". Members log amounts against them. Whoever has the
highest total when the window closes is crowned and holds the title until the next close.
Title history, guild achievements and a small XP bonus make it worth coming back.

The point is to push friend groups to compete across different areas of growth — health,
finances, learning, career — instead of only on DORC's built-in quests.

**Done** = ROADMAP 6.1–6.7 checked off, and `client/src/pages/Guild.jsx` is a real page
instead of an eight-line placeholder.

## Prerequisites

These roadmap items have to land first. Guilds are built on top of them, not alongside.

| Item | Why guilds need it |
| --- | --- |
| 1.2 | Guild request/response schemas and the window/ranking math live in `packages/shared` |
| 1.5 | Every guild route ships with its membership test |
| 2.1 | Bearer auth, so the new routes don't inherit the custom `token` header |
| 2.3 | Invite redemption and entry logging are rate-limited |
| 2.5 | The GitHub connector stores its OAuth token with AES-256-GCM |
| 2.7 | Guild routes validate with Zod from day one, not express-validator |
| 3.1, 3.4 | User `xp` field and the XP engine, which title and achievement bonuses go through |

## Concepts

- **Guild** — a group of users. Private and invite-only until 6.8.
- **Membership** — a user's place in a guild, with a role: `owner` (exactly one),
  `officer`, or `member`.
- **Tracker** — a metric the guild competes on: a name, a unit, a category, a window
  (`weekly` | `monthly`), and the title awarded to the window's winner.
- **Entry** — one logged amount against a tracker by one member, for one calendar day.
- **Window** — one week or month of a tracker, in the guild's timezone.
- **Title** — awarded to the top scorer of a closed window. Ties share it.
- **Achievement** — a milestone an officer sets up from a system template, e.g.
  "100 Club: 100 cumulative gym hours".
- **Connector** — an external source that writes entries automatically instead of the
  member logging them. GitHub is the first.

## Data model

All guild collections carry `guildId`, so every query can be scoped by it.

| Model | Fields | Indexes |
| --- | --- | --- |
| `Guild` | `name`, `description`, `timezone`, `ownerId`, `memberCount`, `visibility: "private"` | |
| `GuildMembership` | `guildId`, `userId`, `role`, `status: active \| left \| banned`, `joinedAt` | unique `(guildId, userId)` |
| `GuildInvite` | `guildId`, `tokenHash`, `createdBy`, `expiresAt`, `usedAt`, `usedBy` | unique `tokenHash` |
| `GuildTracker` | `guildId`, `name`, `unit`, `category`, `window`, `titleName`, `maxPerEntry`, `maxPerDay`, `source: manual \| github`, `pooledGoal?`, `active` | `(guildId, active)` |
| `GuildEntry` | `guildId`, `trackerId`, `userId`, `amount`, `loggedFor`, `note`, `source`, `status: active \| voided`, `disputedBy: [userId]` | `(trackerId, loggedFor)`; `(guildId, createdAt -1)` for the feed; unique `(trackerId, userId, loggedFor, source)` partial on `source != "manual"` |
| `TitleAward` | `guildId`, `trackerId`, `windowStart`, `windowEnd`, `holderIds`, `score` | unique `(trackerId, windowStart)` |
| `GuildAchievement` | `guildId`, `trackerId?`, `template`, `name`, `threshold` | |
| `MemberAchievement` | `achievementId`, `guildId`, `userId`, `awardedAt` | unique `(achievementId, userId)` |
| `ConnectedAccount` | `userId`, `provider: "github"`, `providerUserId`, `login`, `token` (GCM ciphertext), `scopes`, `lastSyncedAt` | unique `(provider, providerUserId)`; unique `(userId, provider)` |

`loggedFor` is a `"YYYY-MM-DD"` string in the **guild's** timezone — the same convention as
`QuestCompletion.completedOn`, for the same reason.

Achievement templates: `cumulative_total`, `period_streak`, `title_count`, `first_entry`.

## Security rules

Every step below obeys these. Anything touching membership, invites or XP ships with its
integration test in the same commit — the 3.3 discipline.

- **Membership check on every route.** A `requireGuildRole(minRole)` middleware resolves
  the guild from `:guildId` and the caller's *active* membership. A non-member gets
  **404, not 403**, so a private guild's existence doesn't leak.
- **No cross-guild ID smuggling.** Tracker, entry and achievement routes assert that the
  child document's `guildId` equals the URL's `:guildId`. Resolving a tracker by id alone
  is how a member of guild A writes into guild B.
- **Invite tokens are treated like auth tokens.** 32 random bytes; only the SHA-256 hash is
  stored; 7-day expiry; single use. Redemption is one atomic
  `findOneAndUpdate({ tokenHash, usedAt: null, expiresAt: { $gt: now } })` so two
  concurrent redeems can't both succeed. Banned users can't redeem. Rate-limited.
- **Role invariants.** Exactly one owner. The owner can't leave without transferring
  ownership first. Officers can't change the owner's role or another officer's.
- **Entries.** Only the author can edit or delete an entry, and only while its window is
  open. Caps are enforced on the server. Connector entries can't be edited by hand.
- **GitHub token.** Least scope (`read:user`), encrypted at rest, never sent to the client.
  The unique `(provider, providerUserId)` index stops two DORC accounts claiming one GitHub
  identity.
- **Pure logic is shared.** `windowFor`, `rankWindow`, the achievement evaluators and the
  XP bonus constants live in `packages/shared/src/guilds.ts`, unit-tested, imported by both
  client and server — so the leaderboard the client draws can't disagree with the title
  the server awards.

## Decisions

Settled in the 2026-09-25 planning interview. Don't relitigate without a reason.

- **Trackers are numeric amount + unit.** A yes/no habit is just a tracker with unit
  "times" and amount 1. One model covers gym hours, commits and dollars.
- **Trust is honor system + disputes + caps.** Entries show in the guild feed where friends
  can dispute them; each tracker has `maxPerEntry` and `maxPerDay` sanity caps. Proof
  uploads were rejected (see Out of scope).
- **Connectors, GitHub first.** Chris wants verified sources where they exist. GitHub uses
  an OAuth link with `read:user` scope and the GraphQL `contributionsCollection`. A typed
  username was rejected because anyone could claim a prolific stranger's account.
- **Scoring is raw total in the window.** Most hours / commits / dollars wins.
- **Guild entries never award XP directly.** Winning a title or earning a guild achievement
  grants a *fixed* bonus through the Phase 3 XP engine. Guilds invent their own trackers,
  so per-entry XP would let a guild farm the global leaderboard.
- **Titles show both a live leader and an official holder.** During a window, the current
  leader is shown. At close, the top scorer is crowned and keeps the title until the next
  close. Past holders are kept ("3× Gym Bro of the Week").
- **Achievements are system templates with guild thresholds.** Officers pick a template,
  a name and a threshold. No free-form rules, so everything is evaluated automatically.
- **Amounts are always visible to guild members.** No per-tracker "rank only" mode for now.
- **Guilds will be discoverable publicly, but not until after ROADMAP 8.5.** Private
  invite-only guilds ship first. When public guilds arrive, a non-member sees only a
  profile card — name, description, member count, tracker names, current title holders.
  Never amounts, entries or the feed, so nobody's savings number reaches a stranger.

Design calls made without asking — overrule any of them by editing this list:

- **Crowning is lazy, not a cron job.** Render's free tier sleeps, so a scheduled job can't
  be trusted to run. Any read of a guild calls `closeDueWindows(guildId)`, which crowns
  every window that's due. The unique `(trackerId, windowStart)` index on `TitleAward`
  makes it idempotent, so two concurrent reads can't crown twice.
- **24-hour grace period** after a window closes before it's crowned. It covers logging
  yesterday's session and disputes on last-day entries. The live leader shows meanwhile.
- **Windows use the guild's timezone**, set by the owner and validated with
  `server/utils/timezone.js`. Entries can be logged for today or yesterday only.
- **Anti-farm limits.** At most 10 active trackers per guild. The title bonus is only paid
  if at least 2 members logged in that window. Bonus amounts are constants in
  `packages/shared`, never configurable per tracker.
- **Solo quest completions stay out of the guild feed.** The feed is guild activity only —
  entries, crowns, achievements. This replaces the old roadmap's "feed of member
  completions": joining a guild shouldn't publish your private habits.
- **Pooled goals survive** from the old roadmap as an optional `pooledGoal` on a tracker —
  the whole guild's total against one target.
- **Caps:** 25 members per guild, 5 guilds per user. Only officers and the owner create
  trackers.

## Open questions

Each one has the assumption the build uses until someone answers.

**For the team (Owen, Diane):**

1. **Dispute threshold.** Assumption: an entry is voided when disputes reach half of the
   *other* active members, rounded up — or when any officer voids it. In a two-person guild
   that means one friend can void the other's entry. Acceptable, or should small guilds
   need an officer?
2. **Caps** of 25 members / 5 guilds per user / 10 trackers per guild. Assumption: as stated.
3. **Grace period length.** Assumption: 24 hours.
4. **XP bonus amounts** for a title and for a guild achievement. Assumption: set during 5.1
   when the level curve gets tuned; placeholder constants until then.

**For Chris:**

5. **Connectors after GitHub** — Strava, Apple Health export, manual CSV? Assumption: none
   in this plan.
6. **Phase 7.1 overlap.** Tracker leaderboards already are per-guild leaderboards.
   Assumption: 7.1 becomes global-only once 6.3 lands; the roadmap wording hasn't been
   changed yet.

---

## Plan

One step ≈ one commit.

### 6.1 Guild core

- [ ] Zod schemas and inferred types for guild, membership and invite requests/responses in
  `packages/shared/src/guilds.ts`, exported from `packages/shared/src/index.ts`.
- [ ] `Guild` and `GuildMembership` models. `POST /api/guilds` (creator becomes owner),
  `GET /api/guilds` (my guilds), `GET /api/guilds/:guildId`. `requireGuildRole` middleware.
  Tests: non-member gets 404; creating a sixth guild is rejected.
- [ ] Role management: promote/demote, kick, ban, leave, transfer ownership. Tests for each
  invariant in **Security rules**.
- [ ] `Guild.jsx`: my guilds list, create form, guild detail shell at `/guild/:guildId`.

### 6.2 Invites

- [ ] `GuildInvite` model; create and revoke (officer+); redeem endpoint. Tests: expired,
  reused, revoked, banned user, guild at member cap, two concurrent redeems — exactly one
  succeeds.
- [ ] Client: invite-link generator on the guild page and a `/join/:token` page.

### 6.3 Trackers and entries

- [ ] `GuildTracker` model with officer-only create/edit/archive and the 10-tracker cap.
  `windowFor(date, window, timeZone)` in shared, with tests across DST changes and
  month/year boundaries.
- [ ] `GuildEntry`: log for today or yesterday (guild timezone), edit/delete own entry
  while the window is open, enforce `maxPerEntry`/`maxPerDay`. Tests: tracker id from
  another guild, editing another member's entry, over the cap, entry for a closed window.
- [ ] Live leaderboard per tracker window (aggregation over active entries) returning the
  current leader. Client tracker view with the leaderboard and a log form.
- [ ] Optional `pooledGoal` on a tracker, shown as a guild-wide progress bar.

### 6.4 Titles

- [ ] `TitleAward` model and `closeDueWindows(guildId)`: lazy, idempotent, respects the
  grace period, ties share the title, skips windows nobody logged in. Tests: concurrent
  calls crown once; a window inside its grace period isn't crowned.
- [ ] Title XP bonus through the Phase 3 XP engine, paid once per holder per award and only
  if ≥2 members participated. Title history on the guild page and member profile.

### 6.5 Disputes and feed

- [ ] Dispute / withdraw dispute; void on threshold or officer action; voided entries drop
  out of leaderboards and crowning. Tests: can't dispute your own entry; can't dispute
  twice; a non-member can't dispute.
- [ ] Guild feed of entries, crowns and achievements, newest first, cursor-paginated.

### 6.6 Achievements

- [ ] `GuildAchievement` and `MemberAchievement` models; the four templates as pure
  evaluators in shared, unit-tested.
- [ ] Evaluate on entry write and on crown; award the XP bonus exactly once. Officer UI to
  create achievements; earned ones shown on the member's profile.

### 6.7 GitHub connector

- [ ] **Spike first:** confirm what `read:user` plus `contributionsCollection` returns for
  private-repo contributions, and what the rate limits look like. Record the answer in
  **Decisions** before building.
- [ ] `ConnectedAccount` model and the GitHub OAuth link/unlink flow: env-driven callback
  URL, `state` parameter checked on return, token encrypted with GCM. Carry over whatever
  2.4 learned fixing Google OAuth.
- [ ] Sync: a `source: github` tracker upserts one entry per linked member per day.
  Triggered on view (throttled per member) and once daily. Manual entries are rejected on
  GitHub trackers; members without a linked account see a "link GitHub" prompt.

### 6.8 Public discovery — blocked on ROADMAP 8.5

Don't start until site-wide moderation exists. Strangers joining guilds needs it.

- [ ] `visibility: "public"`; a directory endpoint returning the profile card only; join
  requests approved by officers; report-a-guild feeding 8.5's moderation queue.
  Revisit the "amounts always visible" decision before shipping this.

---

## Out of scope / deferred

- **Proof uploads (photos/screenshots).** Needs file storage Render's free tier doesn't
  give us, and proof images become a privacy and moderation surface.
- **Per-tracker "rank only" privacy.** Chris chose always-visible amounts. Revisit if
  finance trackers make people uncomfortable, and before 6.8 regardless.
- **Goal-percentage scoring.** Raw totals were chosen. Revisit if finance trackers feel
  unfair across different incomes.
- **Guild-vs-guild standings.** Stays in ROADMAP 7.3.
- **Connectors beyond GitHub.** See open question 5.
- **Solo quest completions in the guild feed.** Deliberately excluded for privacy.
