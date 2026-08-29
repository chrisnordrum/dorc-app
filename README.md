# DORC

**Do. Outplay. Rank. Conquer.**

A gamified habit tracker. Create quests for the things you're trying to do consistently,
earn XP for completing them, level up, unlock badges, and join guilds with friends to keep
each other honest.

| | |
|---|---|
| **Client** | React 19 + Vite + Tailwind, deployed on Vercel |
| **API** | Express 5 + Mongoose, deployed on Render |
| **Database** | MongoDB Atlas |
| **Auth** | Hand-rolled JWT (short-lived access token + HttpOnly refresh cookie) + Google OAuth |

DORC began as a SAIT Web Security Fundamentals course project and is now being built out
into a real application. The original course write-up is preserved at
[`docs/security-coursework.md`](docs/security-coursework.md).

---

## Status

**Early build-out.** Authentication works. The game layer largely does not exist yet —
quests, ranks and badges are currently served from a static seed file rather than from
per-user records, so progress does not persist. Replacing that data layer is the current
priority.

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for what's being built, in what order, and why.
Start there before picking up work.

## Running it locally

**Prerequisites:** Node.js 22+, OpenSSL, and a MongoDB Atlas connection string (or a local
`mongod`).

```bash
git clone https://github.com/chrisnordrum/daily-quest-tracker.git
cd daily-quest-tracker
npm install
```

### Environment

```bash
cp server/.env.example server/.env
```

Then fill in `server/.env`:

- `MONGODB_URI` — your Atlas connection string.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from the
  [Google Cloud Console](https://console.cloud.google.com/), if you need OAuth locally.
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `SESSION_SECRET` — generate each one
  separately with `openssl rand -hex 64`.
- `EMAIL_ENCRYPTION_SECRET`, `BIO_ENCRYPTION_SECRET` — must be exactly 16 bytes for the
  current AES-128 implementation: `openssl rand -hex 8`.

Never commit `server/.env`. It is gitignored; keep it that way.

### Local HTTPS certificate

The dev server runs over HTTPS with a self-signed certificate, so the local environment
matches production. From the `server` directory:

```bash
openssl genrsa -out private-key.pem 2048
openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
```

Both `.pem` files are gitignored. Your browser will warn about the self-signed
certificate on first visit — that's expected locally.

### Start

```bash
npm run dev
```

This runs the API and the client together. The client is at
[http://localhost:5173](http://localhost:5173); it proxies `/api` to the API on
port 5050.

To run them separately, use `npm run dev:server` and `npm run dev:client`.

## Repository layout

```
client/      React + Vite front end (deployed to Vercel)
server/      Express API (deployed to Render)
docs/        Roadmap and the archived security coursework
.github/     CI and the scheduled dependency audit
```

## Contributing

`main` is not protected — CI is the safety net, so **do not push work that hasn't passed
locally.** Details, conventions and the current task list are in
[`docs/ROADMAP.md`](docs/ROADMAP.md).
