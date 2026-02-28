# dorc-app

DORC is a MERN stack RPG-style productivity app that turns habit-building into a game. Users create personal quests (habits or goals), earn XP for completing them, level up, unlock badges, and join guilds with friends to share progress and stay motivated.

---

## Setup Instructions

### Prerequisites

Make sure you have Node.js installed on your device.

### Installation

1. Clone the repository

```
git clone https://github.com/chrisnordrum/dorc-app.git
```

2. Go to the project directory within the terminal to install the dependencies:

```
cd server
npm install
cd ../client
npm install
```

3. Within the <code>server</code> directory, create a <code>config.env</code> file and copy the environment variables as shown in the <code>config.env.example</code> file

```
cp config.env.example config.env
```

### Development

1. Go to the project directory within the terminal to start the server

```
npm run dev
```

2. Open another terminal window, go to the project directory to start the client

```
cd client
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser during development (changes to React files appear instantly due to Hot Module Replacement (HMR))

## SSL Configuration

### SSL Certificate

We opted for a self-signed OpenSSL certificate as it was the easiest method at the time, and fit well into the in-class activities we had already done. We had also opted for this one as we were still in early local development phase, and didn't yet have a final build to properly secure. We didn't yet have experience with CertBot and Let's Encrypt just yet, but we will be looking into implementing those in future builds.

### Security Headers

We used the [Helmet](https://helmetjs.github.io/) middleware to set HTTP response headers for the app.

- We set the <code>frame-ancestors</code> within the Content Security Policy header to <code>'none'</code> and legacy X-Frame-Options header to <code>{ action: "deny" }</code> to reject all frame embedding since we won't be using frames within our app.
- We set the <code>font-src</code> within the Content Security Policy header to <code>'self'</code> to reject all external fonts because we have fonts saved in our client directory and do not need to import any external fonts.
- The rest of the headers are set by default by the [Helmet](https://helmetjs.github.io/) middleware and are standard in securing web applications and also align with our project.

The next step for security headers is to incorporate nonces for script and style sources to only allow the user to load intended resources.

## Caching Strategies

### Static Assets

Badge images are static assets that rarely change and are considered version-stable resources within the application.
Caching them for 30 days can improves performance, reduces server load, and enhances user experience without affecting dynamic application data.

Since these images are design assets that are not expected to change frequently, long-term caching is appropriate.

From a security perspective, these assets contain no sensitive or user-specific information, making them safe to cache publicly. Long-term caching also reduces unnecessary repeated requests to the server, minimizing exposure to certain traffic-based attacks and lowering the overall attack surface.

### API Routes

Caching headers are defined in the controllers so that cache behavior can be tailored to the specific data and purpose of each endpoint. This approach keeps the logic organized and makes future updates or version upgrades easier to manage without creating confusion.

1. Controller: Get all quests
   Handles GET requests to fetch all quests from the database.
   Reasons for not caching this response:

- The quests are dynamic and change based on the user's progress.

2. Controller: Get all ranks
   Handles GET requests to fetch all ranks from the database.
   Reasons for not caching this response:

- The ranks are dynamic and change based on the user's progress.

3. Controller: Get all users
   Handles GET requests to fetch all users from the database.
   Reasons for not caching this response:

- The content of users is sensitive and should not be cached.

4. Controller: Get all badges
   Handles GET requests to fetch all badges from the database.
   Reasons for caching the response for 1 month:

- The content is static and does not change frequently.

5. Controller: Get daily quotes
   Handles GET requests to fetch daily quotes from the database.
   Reasons for not caching this response:

- Allows immediate updates if any inappropriate content needs to be changed or removed.

### SPA Fallback

This route ensures any client-side route is handled by the client. The SPA Fallback replaces the server-side 404 error by serving the application shell.

The caching policy chosen for this route is <code>no-cache</code> to ensure the user is always served the latest build.

### Vite and React Build

All client-side routing is handled by [React Router](https://reactrouter.com/) including 404 errors. Caching for client-side routes are handled efficiently by [React](https://react.dev/).

### 500 Error

For temporary server errors, the <code>no-cache</code> caching policy is set to ensure temporary server errors are not stored and cannot be potentially exploited.

## Lessons Learned

- **Implementing HTTPS** - Perhaps the hardest part about implementing HTTPS into the site was configuring it to be compatible with it in the first place. The server's VITE system required reconfiguring to properly feed the right files from the server.

- **Setting Up Helmet** - Helmet is very easy to use and their default security headers are standard in securing a web application. In addition to security headers, we learned that the middleware can also handle the HSTS policy for HTTPS and allowed us to remove the HSTS dependancy and streamline our code.

- **Fetch API Data**
  - When fetching data from an API, never assume that the request will succeed. The server can always return an error status (e.g., 404 or 500). So ensure that the app handles error gracefully.
  - Using `UseEffect` runs API requests when the component first loads. The UI renders before the data is returned, so setting a safe initial state (an empty array) is important to prevent errors when handling asynchronous data.
  - Adding loading states helped improve UX by giving feedback while data is being fetched.
