# DORC Roadmap

Working document for Chris, Owen and Diane. Check things off as they land.

Each numbered item is sized to be **one commit and one sitting**. Nothing depends on
remembering context from three weeks ago — if you pick up a task cold, the task text plus
the file it names should be enough.

---

## Where the project actually stands

DORC has working authentication and nothing else. That's the honest summary.

**What works:** register, login, refresh, logout, profile edit — all against MongoDB Atlas,
with argon2id password hashing, role-based admin routes, Helmet CSP on API responses, and
a Swagger spec.

**What doesn't:** the game. Quests, ranks, badges and daily quotes are all read from
`server/data/data.json` — a static file, identical for every user, unconnected to accounts.
`POST /api/quests` writes to that file, and Render's filesystem is ephemeral, so every write
is lost on the next restart or deploy. There is no XP, no leveling, no streaks and no
badge-earning logic anywhere in the codebase. `client/src/pages/Guild.jsx` is eight lines of
placeholder.

Everything below Phase 3 is blocked on replacing that data layer.

### Phase 0 findings (verified 2026-08-29)

Recorded here so nobody re-investigates.

**Database — safe to wipe.** The `dorc-app` Atlas database contains exactly one collection
(`users`) holding **2 documents**, both `authProvider: "local"` test accounts, both
`role: "user"`. There is no admin account, so `/admin` is currently unreachable by anyone.
No quest, badge or rank data has ever been persisted. We can therefore fix the `User` schema
in Phase 3 without writing migration scripts.

**Local secrets are strong.** `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are 128
characters, `SESSION_SECRET` is 82. No rotation needed on those.

**Confirmed broken in production** (probed against the live deployment):


| Issue                                | Evidence                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Google OAuth cannot work             | `/auth/google` redirects with `redirect_uri=https%3A%2F%2Flocalhost%3A5050%2Fauth%2Fgoogle%2Fcallback` |
| `/api-docs` is public                | Returns 200 to anonymous requests in production                                                        |
| `GET /api/quests` is unauthenticated | Returns the seed data to anyone; `questsRoutes.js` has no auth middleware at all                       |
| Cold starts are severe               | 22.4s on the first request to a sleeping Render instance                                               |


**Also found by reading, not yet fixed:**

- **Duplicate-email detection silently does not work.** `utils/crypto.js` generates a random
IV per write, so the same email encrypts differently every time. `authController.js:33`
then compares a plaintext email against stored ciphertext — it can never match. The unique
index on `email` is meaningless for the same reason.
- `validator/user.js:96` passes a third argument to `aesEncrypt`, which takes two. It's ignored.
- Every validator calls `.escape()`, storing HTML entities in the database. A user named
`O'Brien` would be persisted as `O'Brien`. (Neither existing test account has an
affected name, so there's nothing to un-mangle yet.)
- `Leaderboard.jsx:36` depends on `authFetch`, which `useAuthFetch` returns as a new function
identity every render. That's an infinite refetch loop.
- `middleware/passport.js:26` creates OAuth users with an unhashed literal
`"oauth_temp_password"` and omits `email_iv`, which the schema marks required.
- `.github/workflows/update-dependencies.yml` runs `npm update` and pushes straight to `main`
with `contents: write` and no tests — an unreviewed path from a dependency release into
production.

---



## How we work

- `main` **is not protected.** Push directly. CI is the safety net, which means
**do not push what hasn't passed locally.** Phase 1.7 adds a pre-push hook so this is
automatic rather than a matter of discipline.
- **New files are TypeScript.** Existing `.js`/`.jsx` converts when you're already editing it.
No big-bang rewrite, no separate migration project.
- **Security-sensitive code ships with its test.** Anything touching auth, ownership or XP
gets an integration test in the same commit. Not later.
- **Update this file in the same commit** as the work it describes.

---



## Phase 0 — Ground truth and safety

- [x] 0.1 Inspect the Atlas cluster; decide migrate-vs-wipe *(wipe — see findings above)*
- [x] 0.3 Confirm what's broken in production against the live deployment
- [x] 0.4 Repo hygiene — deduplicate the root images, move the coursework README to
  ```
  `docs/security-coursework.md`, write a new front-door `README.md`
  ```
- [x] 0.2a Rewrite `server/.env.example` so no value in it looks like a usable secret
  ```
  *(also fixed a real bug: `node --env-file` doesn't support trailing inline comments,
  so the old `EMAIL_ENCRYPTION_SECRET=mysecretkey12345 //16-byte key` produced a
  30-byte key and an AES failure for anyone following it)*
  ```
- [x] 0.2b **Verify Render's environment variables** are the strong secrets, not the old
  ```
  placeholders. Rotate anything weak. *(Needs Render dashboard access.)*
  ```

---



## Phase 1 — Monorepo, TypeScript, CI

No behaviour changes. This is the foundation three people work in.

- [x] 1.1 npm workspaces (`client`, `server`, `packages/shared`), one lockfile. Delete the
  ```
  stale `dependencies` block in the root `package.json` — it duplicates `express`,
  `mongoose`, `helmet`, `jsonwebtoken`, `axios` and others that are never imported at
  root. Move `react-router-dom` and `tailwindcss` out of `client` devDependencies, where
  they're misfiled.

  *(Done. `react-router-dom` moved to `client` dependencies. `tailwindcss` was left in
  devDependencies — it's only referenced by `postcss.config.js` and a JSDoc type in
  `tailwind.config.js`, so it is build-time only, same as `postcss`, `autoprefixer` and
  `vite` beside it. Vercel installs devDependencies, and the build passes.
  Also folded in, because deleting `client/package-lock.json` and
  `server/package-lock.json` breaks them otherwise: both workflows now install once from
  the root lockfile. That is only the lockfile-path fix — 1.6 and 1.8 still rewrite them.)*
  ```
- [ ] 1.2 `packages/shared` — Zod schemas for every API request/response, the types inferred
  ```
  from them, and the pure XP math. This is the payoff: a contract change becomes a
  compile error in the client instead of a runtime surprise.

  *Decide here how the two consumers import it: `packages/shared` is `"type": "module"`
  and `server` is `"type": "commonjs"`, so a CommonJS `require("@dorc/shared")` won't
  work as things stand. Either the server moves to ESM, or shared emits both. Its
  `package.json` has no `main`/`types`/`exports` yet — 1.3 left that for this item.*
  ```
- [x] 1.3 `tsconfig.base.json` with `strict: true` and `allowJs: true`; per-workspace configs
  ```
  extending it.

  *(Done. `checkJs` is deliberately **off**: `allowJs` pulls the existing `.js`/`.jsx` in so
  TypeScript can resolve imports into it, while `checkJs: false` keeps those ~50 unconverted
  files from failing CI. Opt a single file in with `// @ts-check` at the top when you're
  ready to convert it.

  Four configs, not three — `client/tsconfig.node.json` covers the build tooling
  (`vite.config`, `postcss.config`, `tailwind.config`, `eslint.config`) separately, so
  `@types/node` globals can't shadow the DOM ones in application code. `packages/shared`
  gets `"types": []` on purpose: if something in there needs a node or DOM global, it isn't
  shared code.

  `npm run typecheck` at the root fans out to all three workspaces — that's the script 1.6
  calls. Added `typescript` and `@types/node` to root devDependencies, and a stub
  `packages/shared/src/index.ts` so the empty workspace has something to check.)*
  ```
- [ ] 1.4 One flat ESLint config at root covering all workspaces (hoist the existing
  ```
  `client/eslint.config.js`), plus Prettier and a `format:check` script.
  ```
- [ ] 1.5 Vitest + `supertest` + `mongodb-memory-server`. Requires splitting `server/index.js`
  ```
  so the configured `app` is exported separately from the `listen` call. Ship with three
  passing tests: register → login → refresh; unauthenticated request gets 401; non-admin
  hitting `/api/admin/users` gets 403.
  ```
- [ ] 1.6 Rewrite `.github/workflows/node.js.yml`: one job on Node 22 (drop the 18/20/22
  ```
  matrix — we control the runtime), running `npm ci` → lint → format:check →
  `tsc --noEmit` → test → build → `npm audit --audit-level=high`, on push to `main` and
  on PRs.
  ```
- [ ] 1.7 Husky pre-push hook: lint + typecheck + tests.
- [ ] 1.8 Change `update-dependencies.yml` to open a PR instead of pushing to `main`.

---



## Phase 2 — Harden auth

Before features get built on top of it. Retrofitting auth once quests, guilds and
leaderboards depend on it costs far more.

- [ ] 2.1 `Authorization: Bearer` instead of the custom `token` header
  ```
  (`middleware/auth.js:7`, `hooks/useAuthFetch.js`).
  ```
- [ ] 2.2 **Refresh token rotation with reuse detection.** Highest-value item in this phase.
  ```
  A `RefreshToken` collection storing token hashes with a `family` id; rotate on every
  refresh; if an already-used token comes back, revoke the whole family. Today a refresh
  token is an unrevocable 24h JWT that replays freely if stolen. This also gives us real
  "log out everywhere".
  ```
- [ ] 2.3 `express-rate-limit` — strict on `/api/auth/login`, `/register`, `/refresh`; looser
  ```
  globally. Set `app.set("trust proxy", 1)` or Render's proxy collapses every client to
  one IP. *(There is currently no rate limiting anywhere.)*
  ```
- [ ] 2.4 Fix Google OAuth: env-driven callback and redirect URLs; mint our own tokens in the
  ```
  callback and **delete `express-session` + `passport.session()`** so there's one
  stateless auth model instead of two. Fix the user-creation path in `passport.js:26`.
  ```
- [ ] 2.5 Fix the email encryption: add a deterministic unique-indexed `emailHash`
  ```
  (HMAC-SHA256 of the normalized email) for lookups, and upgrade the ciphertext to
  AES-256-GCM so it's authenticated. Lookups use the hash; ciphertext stays for display.
  *(Alternative if the custom crypto stops earning its keep: drop field encryption and
  rely on Atlas encryption at rest.)*
  ```
- [ ] 2.6 Remove `.escape()` from the validators; escape at output instead.
- [ ] 2.7 Replace express-validator with the shared Zod schemas from 1.2.
- [ ] 2.8 Password minimum 8 → 12, plus a Have I Been Pwned k-anonymity check on register and
  ```
  password change. Free, no API key.
  ```
- [ ] 2.9 Explicit CORS allowlist; gate `/api-docs` behind admin auth in production; add
  ```
  security headers to `client/vercel.json` — Helmet only covers API responses, so the
  Vercel-hosted front end currently ships none.
  ```

---



## Phase 3 — The per-user data model

**The milestone.** Where DORC stops being a demo.

- [ ] 3.1 Models: `Quest` (owned, with difficulty, category, recurrence, xpReward) and
  ```
  **`QuestCompletion` — an append-only event log, one row per completion.** That log is
  the most important design decision here: streaks, history, the calendar, leaderboards
  and seasonal resets are all queries over it. The boolean `completed` flag that
  `data.json` uses can express none of them. Plus `Badge`/`UserBadge` and the user
  progression fields (`xp`, `level`, `currentStreak`, `longestStreak`).
  ```
- [ ] 3.2 Delete `data.json` and `models/db.js`. Badges, ranks and quotes become
  ```
  `server/scripts/seed.ts`.
  ```
- [ ] 3.3 **Ownership enforcement on every quest route** — resolve the document, assert
  ```
  `quest.owner.equals(req.user.id)`. Broken object-level authorization is the most common
  serious vulnerability in this kind of app, and these routes currently have *no auth
  middleware at all*. Ship the test (user A cannot read, complete or delete user B's
  quest) in the same commit.
  ```
- [ ] 3.4 XP engine as pure functions in `packages/shared` — `xpForCompletion`, `levelFromXp`,
  ```
  `xpToNextLevel`. No I/O, exhaustively unit-tested, imported by both sides so the progress
  bar can't disagree with the database.
  ```
- [ ] 3.5 Idempotent completion: unique index on `(quest, user, completionDate)` so
  ```
  double-tapping a daily quest can't farm XP. Award XP in the same operation.
  ```
- [ ] 3.6 Rewire `QuestGrid`, `Quest`, `Profile`, `Leaderboard` to the new authenticated
  ```
  endpoints. Fix the `useAuthFetch` refetch loop with `useCallback` while you're there.
  ```
- [ ] 3.7 Create a real admin account (there isn't one) and confirm `/admin` works.

---



## Phase 4 — Quest quality of life

The unglamorous layer that decides whether anyone opens the app twice. Cheap now, because
Phase 3 built the right primitives.

- [ ] 4.1 Recurring and scheduled quests off the recurrence rule
- [ ] 4.2 Difficulty tiers driving XP
- [ ] 4.3 Categories and filtering
- [ ] 4.4 A "Today" view as the default landing page for logged-in users
- [ ] 4.5 History and calendar views over `QuestCompletion`
- [ ] 4.6 Streak display
- [ ] 4.7 Quest editing and archiving

---



## Phase 5 — Solo progression depth

- [ ] 5.1 Tune the level curve against real completion data
- [ ] 5.2 Badge rules engine evaluated on each completion — the six images in
  ```
  `server/public/badges/` are already there and completely unused
  ```
- [ ] 5.3 Per-category stats
- [ ] 5.4 Rank tiers
- [ ] 5.5 Profile showcase

---



## Phase 6 — Guilds

Replaces the placeholder page. Every read and write needs a membership check, and invite
tokens deserve the same care as auth tokens — same test discipline as 3.3.

- [ ] 6.1 `Guild` and `GuildMembership` models with roles (owner / officer / member)
- [ ] 6.2 Single-use invite tokens with expiry
- [ ] 6.3 Guild feed of member completions
- [ ] 6.4 Shared guild goals with pooled progress

---



## Phase 7 — Competition

- [ ] 7.1 Global and per-guild leaderboards as aggregation pipelines over `QuestCompletion`
- [ ] 7.2 Seasons with weekly and monthly windows
- [ ] 7.3 Guild-vs-guild standings
- [ ] 7.4 Cache the aggregations — first place free-tier Atlas will feel slow

---



## Phase 8 — Public launch readiness

Required before strangers can sign up.

- [ ] 8.1 Email verification and password reset (Resend's free tier is 3k/month)
- [ ] 8.2 Account deletion and data export — PIPEDA applies to us in Alberta; GDPR too if
  ```
  anyone in the EU signs up
  ```
- [ ] 8.3 Privacy policy and terms
- [ ] 8.4 Sentry free tier for errors; `pino` for structured logs
- [ ] 8.5 Admin moderation tools — `Admin.jsx` is currently a shell
- [ ] 8.6 **Backups.** Atlas M0 has none. A scheduled GitHub Action running a dump into an
  ```
  encrypted artifact is the free answer.
  ```
- [ ] 8.7 Full security review over the finished feature set



### On cold starts

Render's free tier sleeps after ~15 minutes; we measured a 22.4s first request. The honest
mitigation is a real loading state on `AuthContext`'s startup refresh, so it reads as loading
rather than broken. A keep-alive cron works but consumes ~720 of the 750 free instance-hours
per month — viable with exactly one service and no margin. When there are real users, $7/month
for Render Starter is the fix.