# dorc-app

DORC is a MERN stack RPG-style productivity app that turns habit-building into a game. Users create personal quests (habits or goals), earn XP for completing them, level up, unlock badges, and join guilds with friends to share progress and stay motivated.

<div style="display: flex; flex-wrap: wrap; gap: 8px;">
  <img src="https://img.shields.io/badge/-MongoDB-002548?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/-Express-002548?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/-React-002548?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/-Node.js-002548?style=for-the-badge" />

  <img src="https://img.shields.io/badge/-JavaScript-002548?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
  <img src="https://img.shields.io/badge/-Vite-002548?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/-TailwindCSS-002548?style=for-the-badge&logo=tailwindcss&logoColor=38B2AC" />
  <img src="https://img.shields.io/badge/-JWT-002548?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/-Helmet-002548?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-HTTPS-002548?style=for-the-badge&logo=google-chrome&logoColor=white" />
</div>

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [SSL Configuration](#ssl-configuration)
- [Caching Strategies](#caching-strategies)
- [Authentication Mechanisms](#authentication-mechanisms)
- [Role-Based Access Control](#role-based-access-control)
- [Input Validation Techniques](#input-validation-techniques)
- [Ouput Encoding Methods](#output-encoding-methods)
- [Encryption Techniques](#encryption-techniques)
- [Third-Party Libraries Dependency Management](#third-party-libraries-dependency-management)
- [Security Testing](#security-testing)
- [Vulnerability Fixes](#vulnerability-fixes)
- [Testing Tools](#testing-tools)
- [Ethical Responsibilities of Security Professionals](#ethical-responsibilities-of-security-professionals)
- [Legal Implications of Security Testing](#legal-implications-of-security-testing)
- [AI Tools](#ai-tools)
- [Lessons Learned](#lessons-learned)
  - [Phase 1](#phase-1-establishing-a-secure-https-server)
  - [Phase 2](#phase-2-authentication-and-authorization-mechanisms)
  - [Phase 3](#phase-3-implementing-security-best-practices)
  - [Phase 4](#phase-4-security-testing-and-ethical-and-legal-considerations)

---

## Setup Instructions

### Prerequisites

- Make sure you have [Node.js](https://nodejs.org/en) and [OpenSSL](https://www.openssl.org/) installed on your device.
- Make sure you have a [MongoDB](https://www.mongodb.com/) database set up (MongoDB Atlas or local MongoDB).
- Make sure you have a Google account and access to the [Google Cloud Console](https://console.cloud.google.com/) for OAuth setup.

### Installation

1. Clone the repository

```bash
git clone https://github.com/chrisnordrum/dorc-app.git
```

2. Go to the project directory within the terminal to install the dependencies:

```bash
cd server
npm install
cd ../client
npm install
```

### Environment Variables

1. Go to the `server` directory, create a `.env` file and copy the environment variables as shown in the `.env.example` file

```bash
cp .env.example .env
```

2. Inside the `.env` file, make sure to change the value of `MONGODB_URI` to your own [MongoDB Atlas](https://www.mongodb.com/products/platform) connection string using the `Mongoose` driver

```env
MONGODB_URI=mongodb+srv://<username>:<db_password>@cluster0.ifhq3qs.mongodb.net/?appName=Cluster0
```

3. Change the values of `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to your own Google 0Auth credentials from the [Google Cloud Console](https://console.cloud.google.com/)

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. **Make sure** to change the values of `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `SESSION_SECRET`, `EMAIL_ENCRYPTION_SECRET` and `BIO_ENCRYPTION_SECRET` with your own secret keys ( _just in case Oda finally reveals the One Piece!_ )

```env
ACCESS_TOKEN_SECRET=THE
REFRESH_TOKEN_SECRET=0NE
SESSION_SECRET=P1ECE
EMAIL_ENCRYPTION_SECRET=YOUR_16_BYTE_KEY
BIO_ENCRYPTION_SECRET=YOUR_16_BYTE_KEY
```

> We generated secure secrets using [OpenSSL](https://www.openssl.org/)
>
> ```bash
> openssl rand -hex 64
> ```

### SSL Configuration

1. Go to the `server` directory and generate a private key

```bash
openssl genrsa -out private-key.pem 2048
```

2. Generate a self-signed certificate

```bash
openssl req -new -x509 -key private-key.pem -out certificate.pem -days 365
```

### Development

1. Go to the project directory within the terminal to start the server

```bash
npm run dev
```

2. Open another terminal window, go to the `client` directory to start the client

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser during development (changes to React files appear instantly due to Hot Module Replacement (HMR))

### Production

1. Go to the project directory within the terminal to start the server

```bash
npm run dev
```

2. Open another terminal window, go to the `client` directory to build the client

```bash
npm run build
```

3. Open [https://localhost:5050](https://localhost:5050) in your browser during production

> Production will pass HTTPS and security headers to the client build

---

## API Documentation

In our team we use Swagger API as our documentation, if you visit [http://localhost:5050/api-docs](http://localhost:5050/api-docs), you can find all APIs with descriptions.

---

## SSL Configuration

### SSL Certificate

We opted for a self-signed OpenSSL certificate as it was the easiest method at the time, and fit well into the in-class activities we had already done. We had also opted for this one as we were still in early local development phase, and didn't yet have a final build to properly secure. We didn't yet have experience with CertBot and Let's Encrypt just yet, but we will be looking into implementing those in future builds.

### Security Headers

We used the [Helmet](https://helmetjs.github.io/) middleware to set HTTP response headers for the app.

- We set the `frame-ancestors` within the Content Security Policy header to `'none'` and legacy X-Frame-Options header to `{ action: "deny" }` to reject all frame embedding since we won't be using frames within our app.
- We set the `font-src` within the Content Security Policy header to `'self'` to reject all external fonts because we have fonts saved in our client directory and do not need to import any external fonts.
- The rest of the headers are set by default by the [Helmet](https://helmetjs.github.io/) middleware and are standard in securing web applications and also align with our project.

The next step for security headers is to incorporate nonces for script and style sources to only allow the user to load intended resources.

---

## Caching Strategies

### Static Assets

Badge images are static assets that rarely change and are considered version-stable resources within the application.
Caching them for 30 days can improves performance, reduces server load, and enhances user experience without affecting dynamic application data.

Since these images are design assets that are not expected to change frequently, long-term caching is appropriate.

From a security perspective, these assets contain no sensitive or user-specific information, making them safe to cache publicly. Long-term caching also reduces unnecessary repeated requests to the server, minimizing exposure to certain traffic-based attacks and lowering the overall attack surface.

### API Routes

Caching headers are defined in the controllers so that cache behaviour can be tailored to the specific data and purpose of each endpoint. This approach keeps the logic organized and makes future updates or version upgrades easier to manage without creating confusion.

#### 1. `questsController` – Get all quests

Handles GET requests to fetch all quests from the database.

- **Caching**: Not cached
- **Reason**: The quests are dynamic and change based on the user's progress.

---

##### 2. `ranksController` – Get all ranks

Handles GET requests to fetch all ranks from the database.

- **Caching**: Not cached
- **Reason**: The ranks are dynamic and change based on the user's progress.

---

#### 3. `usersController` – Get all users

Handles GET requests to fetch all users from the database.

- **Caching**: Not cached
- **Reason**: The content of users is sensitive and should not be cached.

---

#### 4. `badgesController` – Get all badges

Handles GET requests to fetch all badges from the database.

- **Caching**: Cached for 1 month
- **Reason**: The content is static and does not change frequently.

---

#### 5. `dailyQuotesController` – Get daily quotes

Handles GET requests to fetch daily quotes from the database.

- **Caching**: Not cached
- **Reason**: Allows immediate updates if any inappropriate content needs to be changed or removed.

### SPA Fallback

This route ensures any client-side route is handled by the client. The SPA Fallback replaces the server-side 404 error by serving the application shell.

The caching policy chosen for this route is `no-cache` to ensure the user is always served the latest build.

### Vite and React Build

All client-side routing is handled by [React Router](https://reactrouter.com/) including 404 errors. Caching for client-side routes are handled efficiently by [React](https://react.dev/).

### 500 Error

For temporary server errors, the `no-cache` caching policy is set to ensure temporary server errors are not stored and cannot be potentially exploited.

---

## Authentication Mechanisms

### Local Authentication

We used **argon2** to hash user passwords before storing them in the database to ensure a high level of **security** (as it is considered more secure than many other **hashing algorithms**). In addition, all communication is conducted over **HTTPS**, which helps prevent passwords from being exposed during **data transmission**.

#### Password Reset Flow

When our team designed the **UserSchema**, **username** and **email** are required unique in our database. This not only prevents **duplicate accounts**, but also provides a reliable way to **identify users** when handling **password recovery** or **reset processes**.

- The user clicks on **"Forgot Password"**
- The user enters their **email address**
- The backend would send a **temporary password reset link**(10mins) to the user’s email
- The user uses the link to **set a new password**

### SSO Authentication

This app uses SSO Authentication (not to be confused with SSL) using Google's OAuth 2.0 system to help make signin easy for the user, while also increasing security by adding a second layer of authentication to the user login via Google.

### Token Storage and Management

This application implements **JSON Web Tokens (JWT)** using an access token and refresh token system.

- **Access tokens** are short-lived (**10 minutes**) and stored in **React state** to reduce exposure if stolen and prevent storage risks.
- **Refresh tokens** are long-lived (**24 hours**) and stored in an **HttpOnly Cookie**, making them inaccessible to JavaScript and more secure against XSS attacks.

#### Token Refresh System

1. **The server generates tokens after successful `/login` and `/register` requests**

[ Client ] → Login/Register → [ Server ]

                 │
                 ▼
      (validate credentials)
                 │
                 ▼
     ← accessToken + refreshToken →
        - accessToken → React State (Client)
        - refreshToken → HttpOnly Cookie (Server)

2. **The client sends a request to a protected route**

[ Client ] → Request with accessToken → [ Server ]

                 │
                 ▼
        (verify accessToken)

        ✔ VALID
        ────────────────→ Request succeeds

        ✖ EXPIRED
        ────────────────→ 401 Unauthorized

3. **If the server returns a `401`, the client attempts to refresh the access token**

[ Client ] → /auth/refresh → [ Server ]

                 │
                 ▼
     (verify refreshToken from cookie)

        ✔ VALID
        ────────────────→ New accessToken returned
                          Client retries original request

        ✖ INVALID / EXPIRED
        ────────────────→ 403 Forbidden

4. **If the server sends a `403`, the refresh token is invalid or expired**
   - The client logs out the user
   - The client redirects to `/login`

The **token refresh system** strikes a balance between security and user experience:

- **Short-lived access tokens** limit exposure to 10 minutes, which is a short window for hackers to get through and long enough for users to send a few requests without having to wait for verification each time.

- **Long-lived refresh tokens** can't be accessed by the client and give the user 24 hours to use the application uninterrupted by login prompts. If they were to use public devices and forget to log out, another user of the device would only be able to access authenticated routes for 24 hours.

---

## Role-Based Access Control

**DORC** uses a simple role-based access control system with two roles: **User** and **Admin**. This allows us to protect sensitive routes while keeping the permissions system easy to manage.

We enforce access control on both the **frontend** and **backend**. On the frontend, protected routes are only available to logged-in users. On the backend, middleware verifies both authentication and user role before allowing access to sensitive resources.

### Frontend Route Protection

Protected pages are wrapped inside a `ProtectedRoute` component:

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/leaderboard" element={<Leaderboard />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/admin" element={<Admin />} />
</Route>
```

This ensures that only authenticated users can access `/leaderboard` and `/profile`. If a user is not logged in and tries to access these routes, they are redirected to the login page. Once a user is authenticated, they are redirected to the main page instead of seeing the login page again.

The `/admin` route includes an additional role check. If a non-admin user attempts to access /admin, even by manually entering the URL, they are blocked and redirected back to a default page.

The admin dashboard button on `Home.jsx` is only visible to users with the **Admin** role. This ensures that regular users do not see or attempt to access admin functionality through the interface.

### Backend Protection

On the backend, access control is enforced using middleware for both **authentication** and **authorization**. This ensures security even if users try to bypass the frontend.

#### Authentication (`authMiddleware`)

- Extracts token from `req.headers.token`
- Verifies token using `jwt.verify()`
- Attaches decoded user data to `req.user`
- Returns `401 Unauthorized` if:
  - token is missing
  - token is invalid

```jsx
const token = req.headers.token;

if (!token) {
  return res.status(401).json({ message: "No token, authorization denied" });
}

const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
req.user = decoded;
```

#### Authorization (`authorize`)

- Checks if `req.user` exists (user is authenticated)
- Verifies that the user’s role matches the required role
- Returns `403 Forbidden` if role is not allowed

```jsx
if (req.user && roles.includes(req.user.role)) {
  next();
} else {
  return res.status(403).json({
    message: "You are not authorized to access this resource",
  });
}
```

#### Admin Route Protection

Admin routes require **both** authentication and authorization:

```jsx
router.get("/", authMiddleware, auth("admin"), (req, res) => { ... });

router.get("/users", authMiddleware, auth("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});
```

- User must have a **valid JWT Token**
- User must have the **Admin Role**
- Non-admin users receive a `403` response
- Passwords are excluded using `.select("-password")`
- Admins can **view all users (read-only)**

---

## Input Validation Techniques

Improper input validation can lead to vulnerabilities where attackers submit malicious code that gets injected into a website or database. This may result in attacks such as SQL injection, cross-site scripting (XSS), or command injection. Therefore, user input should always be validated and sanitized to filter out harmful content before it is processed or stored.

On the frontend, input is first sanitized to clean and normalize user data before validation. For example, text inputs remove unsafe characters like < and >, names only allow letters and certain symbols, usernames are restricted to lowercase letters, numbers, and underscores, and emails are trimmed and normalized. Passwords are minimally modified to preserve user intent while still removing unnecessary whitespace.

Validation is then applied to ensure the cleaned input meets specific rules:

- Names must follow a defined character pattern and length
- Usernames must be between 3–20 characters and use only allowed characters
- Emails must match a valid email structure
- Passwords must meet minimum length requirements

These checks help ensure that only properly formatted and expected data is accepted before being sent to the server.

On the backend, validation is enforced again using tools like express-validator. This is critical because client-side validation can be bypassed. Server-side validation ensures that all incoming data is secure, properly formatted, and safe before interacting with the database or application logic.

---

## Output Encoding Methods

Output encoding prevents XSS attacks by ensuring that any dynamic content is treated as plain text instead of executable code when rendered in the browser. Even if malicious input slips through, encoding converts characters like <, >, and " into safe representations, preventing scripts from running.

On the frontend, this is further reinforced by using React, which automatically escapes dynamic content by default. This means user-generated data is safely displayed without being interpreted as HTML or JavaScript, unless explicitly overridden (such as with dangerouslySetInnerHTML, which is avoided).

---

## Integration of Frontend and Backend Validation

Frontend and backend validation work together to create a layered approach to application security. On the frontend, input is first sanitized and validated to provide immediate feedback to users and prevent obviously incorrect or unsafe data from being submitted. This improves usability while reducing unnecessary server requests.

However, frontend validation alone is not sufficient, as it can be bypassed. For this reason, the backend performs its own validation using tools such as express-validator. This ensures that all incoming data is checked again before being processed or stored, protecting the application from malicious input.

In addition, output encoding on the frontend ensures that any data returned from the server is rendered safely. Frameworks like React automatically escape dynamic content, preventing it from being interpreted as executable code in the browser.

Together, these layers form a defense-in-depth strategy. The frontend enhances user experience and filters basic input, while the backend enforces strict security rules. This combined approach significantly reduces the risk of vulnerabilities such as XSS and injection attacks.

---

## Encryption Techniques

What challenges did you encounter with encryption, and how did you resolve them?

One of the biggest challenges we encountered with encryption was that the email field was previously required to be unique in the schema. After encrypting the email, the encrypted output changes each time (because of different IVs), which breaks the uniqueness constraint and makes duplicate detection impossible.

To resolve this, we added the encryption and decryption methods into some middlewares. We also stored the IV alongside the encrypted value so the data can be properly decrypted when needed. This approach allowed us to keep the data encrypted while still maintaining the necessary validation and update flow.

---

## Third-Party Libraries Dependency Management

We use GitHub Actions to manage dependencies for both the client and server folders in this project. Since they are separate directories, the workflow runs each step twice using `working-directory`; once for `/server` and once for `/client`.

Every Monday at 9:00 AM (via a cron schedule), the workflow:

- installs dependencies using `npm ci`
- runs `npm audit` to check for vulnerabilities
- updates dependencies safely using `npm update`
- checks again for moderate or higher vulnerabilities
- posts a summary in the Actions tab so we can review any issues

The workflow **does not automatically fix vulnerabilities**, which means we are responsible for reviewing and deciding how to handle them.

### Risks

Outdated libraries can contain known security vulnerabilities that attackers can exploit. They may also stop working properly with newer tools or environments, causing bugs or instability in the app.

Automation helps by regularly checking for vulnerabilities and keeping dependencies up to date without needing manual effort.

The risk is that automation can update dependencies without fully understanding the impact, which might introduce bugs or breaking changes.

---

## Security Testing

### 1. Data Flow Diagram (DFD)

The first step involved creating a Data Flow Diagram (DFD) to understand how data moves through the system. This included identifying key components such as the client (Vite frontend), server (Express API), database, and external services.

Once the DFD was established, trust boundaries were defined to highlight where data transitions between different levels of control (e.g., client → server, server → database).

![DORC threat model diagram](image-1.png)

### 2. STRIDE Framework

Using the **STRIDE framework** made it much easier to break down risks across the actual flow of the app instead of thinking about security in a vague way.

Looking at the diagram, spoofing was one of the first things that stood out. Since everything depends on the authentication step and JWT flow, it became clear that if tokens were compromised or not verified properly, an attacker could act as a real user or even an admin. This made authentication and token handling feel more critical than expected.

Tampering also became more obvious when following the path from the user to the Express server and database. Any data being sent through requests (like profile updates or quests) could be modified if validation wasn’t strong. This reinforced why both frontend sanitization and backend validation are needed, not just one.

Information disclosure ended up being more serious than it first seemed. From the diagram, the server reads and writes to the users database, which contains sensitive data. If API responses, errors, or caching were handled poorly, that data could be exposed. This risk felt higher after mapping it visually.

Elevation of privilege was another big one, especially with the admin flow clearly separated. Since admins can access the dashboard and broader data, any weakness in role checks could let a normal user access admin routes. Seeing that path in the diagram made it clear this is a high-impact risk.

Some risks felt less severe than expected. Denial of service, for example, is possible through the server endpoints, but given the current scale of the app, it didn’t feel as urgent compared to authentication and access control.

#### Impact on Risk Decisions

| Threat Area                         | Severity                                                                            | Likelihood                                                                          | Decision / Action Taken                                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Authentication & JWT Handling       | ![High](https://img.shields.io/badge/High-ff6b81?style=for-the-badge&logo=none)     | ![High](https://img.shields.io/badge/High-ff6b81?style=for-the-badge&logo=none)     | Prioritized secure token system (short-lived access tokens + HttpOnly refresh tokens), strict verification on backend |
| Role-Based Access (Admin vs User)   | ![High](https://img.shields.io/badge/High-ff6b81?style=for-the-badge&logo=none)     | ![Medium](https://img.shields.io/badge/Medium-ffd166?style=for-the-badge&logo=none) | Enforced authorization on both frontend and backend, added middleware to block unauthorized access                    |
| Input Validation (User → Server)    | ![High](https://img.shields.io/badge/High-ff6b81?style=for-the-badge&logo=none)     | ![High](https://img.shields.io/badge/High-ff6b81?style=for-the-badge&logo=none)     | Implemented layered validation (frontend sanitization + backend validation with express-validator)                    |
| Data Protection (Server → Database) | ![High](https://img.shields.io/badge/High-ff6b81?style=for-the-badge&logo=none)     | ![Medium](https://img.shields.io/badge/Medium-ffd166?style=for-the-badge&logo=none) | Restricted sensitive data exposure, avoided caching user data, ensured safe API responses                             |
| Information Disclosure              | ![High](https://img.shields.io/badge/High-ff6b81?style=for-the-badge&logo=none)     | ![Medium](https://img.shields.io/badge/Medium-ffd166?style=for-the-badge&logo=none) | Used output encoding (React defaults), controlled API responses and error messages                                    |
| Denial of Service (DoS)             | ![Medium](https://img.shields.io/badge/Medium-ffd166?style=for-the-badge&logo=none) | ![Low](https://img.shields.io/badge/Low-6ee7b7?style=for-the-badge&logo=none)       | Acknowledged risk but deferred; planned future improvements like rate limiting                                        |
| Dependency Vulnerabilities          | ![Medium](https://img.shields.io/badge/Medium-ffd166?style=for-the-badge&logo=none) | ![Medium](https://img.shields.io/badge/Medium-ffd166?style=for-the-badge&logo=none) | Used automated checks (npm audit, GitHub Actions) to monitor and update dependencies                                  |

### 3. Manual Testing

After identifying potential weak points from the DFD, manual testing was conducted to simulate real-world attack scenarios. This included:

**Input Manipulation:** Testing form fields and API requests with unexpected or malicious inputs (e.g., SQL injection strings, script tags for XSS).

**API Testing:** Using tools like Postman to directly interact with backend endpoints and verify whether proper validation and authorization checks were enforced.

**Client-Side Testing:** Inspecting the frontend for exposed sensitive data, improper error messages, or missing security headers.

Manual testing allowed for deeper exploration of logic flaws and edge cases that automated tools may not detect.

### 4. Automated Testing with OWASP ZAP

To complement manual testing, automated vulnerability scanning was performed using OWASP ZAP (Zed Attack Proxy). This tool was used to systematically scan the application for common security issues.

The process included:

**Spidering the Application:** Automatically discovering available routes and endpoints.

**Passive Scanning:** Monitoring traffic for issues like missing security headers or insecure cookies without modifying requests.

The automated scan helped identify:

Missing or misconfigured security headers (e.g., CSP, X-Frame-Options)
Potential injection vulnerabilities
Insecure dependencies or outdated libraries

---

#### Vulnerabilities Found:

1. **CSP Wildcard / Overly Broad Directive**

- **Type of Vulnerability:** Security Misconfiguration (Content Security Policy weakness)
- **Affected Area:** Application-wide HTTP response headers (Content-Security-Policy)
- **Severity Level:** Medium
- **Description:**
  The Content Security Policy (CSP) is configured with overly broad directives, specifically within the style-src policy. The configuration allows sources that are too permissive, reducing the effectiveness of CSP as a defense against attacks like Cross-Site Scripting (XSS).
- **Why This Is a Problem:**
  An overly permissive CSP can allow malicious content (such as injected scripts or styles) to execute in the browser. This weakens one of the main protections against XSS and data injection attacks.
- **Recommended Fixes:**
  Restrict style-src to only trusted domains (e.g., 'self' and specific CDN domains if needed)

2. **CSP Allows unsafe-inline Styles**

- **Type of Vulnerability:** Security Misconfiguration (CSP – Unsafe Inline Usage)
- **Affected Area:** Frontend styling and CSP header configuration
- **Severity Level:** Medium
- **Description:**
  The CSP includes 'unsafe-inline' in the style-src directive. This allows inline CSS to be executed directly within HTML, which weakens CSP protections.
- **Why This Is a Problem:**
  Allowing 'unsafe-inline' can enable attackers to inject malicious styles or potentially exploit style-based attacks. While it primarily affects CSS, it can still be used in combination with other vulnerabilities to bypass security controls.
- **Recommended Fixes:**
  Remove 'unsafe-inline' from the style-src directive

---

## Vulnerability Fixes

Two related vulnerabilities were identified in the application’s **Content Security Policy (CSP)** configuration. Both issues reduced the effectiveness of CSP as a defense against client-side attacks.

---

#### 1. Overly Broad `style-src` Directive

- **Issue:**  
  The CSP configuration allowed overly broad sources in the `style-src` directive, making it too permissive.

- **Fix Implemented:**  
  The `style-src` directive was restricted to `'self'`, ensuring that only styles hosted within the application are allowed. External or untrusted sources were removed unless explicitly required.

- **Impact of Fix:**  
  This significantly reduced the risk of malicious styles being loaded from external sources and strengthened protection against injection-based attacks.

---

#### 2. Use of `'unsafe-inline'` in `style-src`

- **Issue:**  
  The CSP included `'unsafe-inline'`, which allowed inline CSS to execute directly within HTML.

- **Fix Implemented:**  
  The `'unsafe-inline'` value was removed from the `style-src` directive. All styling was moved to external stylesheets controlled by the application.

- **Impact of Fix:**  
  Removing `'unsafe-inline'` improved CSP enforcement by preventing inline style injection, which can be used alongside other vulnerabilities to bypass security controls.

---

### Validation Process

- The application was re-tested using OWASP ZAP to confirm that CSP-related warnings were resolved.
- Browser developer tools were used to verify that only approved style sources (`'self'`) were being loaded.
- Functional testing was performed to ensure that removing inline styles did not break the UI.

---

### Summary

By tightening the `style-src` directive and removing `'unsafe-inline'`, the CSP was made significantly more restrictive. These changes improved the application’s resistance to injection attacks while maintaining expected functionality.

---

## Testing Tools

| Tool                         | Category                                 | Purpose                                                                          | Contribution to Security Evaluation                                                                                                 |
| ---------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Figma                        | Threat Modeling                          | Used to design and visualize the system architecture and data flow diagram       | Helped identify potential threat points across user, server, and database interactions using STRIDE                                 |
| OWASP ZAP (Zed Attack Proxy) | Dynamic Testing / Vulnerability Scanning | Automated tool for scanning web applications for common security vulnerabilities | Detected issues such as XSS, insecure headers, and potential injection points, helping validate and strengthen application security |
| express-validator            | Input Validation                         | Middleware for validating and sanitizing incoming request data on the backend    | Ensured all user input is properly validated, reducing risks of injection attacks and malformed data                                |
| Custom Sanitizers (Frontend) | Input Sanitization                       | Functions used to clean and normalize user input before submission               | Prevented unsafe characters and improved first layer of defense against malicious input                                             |
| Helmet                       | Security Headers                         | Middleware to configure HTTP security headers                                    | Protected against common attacks like clickjacking and improved overall browser-side security                                       |
| npm audit / GitHub Actions   | Dependency Scanning                      | Automated tools to detect vulnerabilities in third-party packages                | Identified outdated or vulnerable dependencies and supported regular security maintenance                                           |

---

## Ethical Responsibilities of Security Professionals

During this project, we made sure our security testing stayed within ethical boundaries. Our main testing tool was OWASP ZAP, which we used to scan for common web vulnerabilities such as weak security headers, insecure configurations, and possible input validation issues. All testing was performed only on our own application and within our own development environment.

We understand that security testing should never be performed on websites, systems, or services without permission. Even if the purpose is educational, testing another organization’s application without authorization would be unethical and could create unnecessary risk.

Since the project is still in development, we did not use real user data. Instead, we worked with test accounts and sample data. Even though the data was not real, we still treated it with the same level of care we would use for production data. This helped us build good security habits early in development.

We also used Docker to simulate a more realistic deployment environment. This gave us the opportunity to test the application in conditions closer to a real server setup while keeping everything controlled and safe.

When weaknesses were identified through ZAP, our goal was to understand them and improve the application rather than misuse them. For example, we reviewed token storage, validation logic, security headers, and access control decisions to strengthen the overall security of the project.

---

## Legal Implications of Security Testing

Security testing also comes with legal responsibilities. Running vulnerability scans or attempting security tests on a system without permission can violate laws, policies, or terms of service, especially if it impacts data, users, or system availability. Because of this, all ZAP scans and related testing for this project were limited to our own application and approved project environment.

Although our application is still in development and does not yet use real user data, privacy laws are still important to consider. As this project was developed in Canada, regulations such as PIPEDA are useful references for how personal information should be collected, stored, and protected if the application is deployed publicly in the future.

These legal and privacy considerations influenced several technical decisions in our project:

- using HTTPS to protect data during transmission
- hashing passwords with argon2
- storing refresh tokens in HttpOnly cookies
- encrypting sensitive fields
- restricting access through role-based authorization
- avoiding caching of sensitive responses

We also used Docker to create a more realistic server-like environment for development and testing. This helped us test the application in an environment that feels closer to a real server setup, while still keeping everything safe and controlled during development.

---

## AI Tools

Which AI tools you used, for which tasks, and how you verified the output

### Third-Party Libraries Dependency Management

For this part of the project, I used ChatGPT to help generate and refine the GitHub Actions workflows and improve my understanding of dependency management concepts.

#### Tasks it was used for:

- Creating and structuring GitHub Actions YAML files
- Debugging and improving workflow configuration
- Explaining how dependency auditing and updates work
- Helping write and refine README documentation

#### How the output was verified:

- Ran the workflows in GitHub Actions to confirm they executed correctly
- Checked that dependencies were installed and updated as expected in both client and server folders
- Verified that audit results appeared correctly in the workflow summary
- Reviewed and tested any generated code manually before using it

---

## Lessons Learned

### Phase 1: Establishing a Secure HTTPS Server

#### Implementing HTTPS

- Perhaps the hardest part about implementing HTTPS into the site was configuring it to be compatible with it in the first place. The server's VITE system required reconfiguring to properly feed the right files from the server.

#### Setting Up Helmet

- Helmet is very easy to use and their default security headers are standard in securing a web application. In addition to security headers, we learned that the middleware can also handle the HSTS policy for HTTPS and allowed us to remove the HSTS dependancy and streamline our code.

#### Fetch API Data

- When fetching data from an API, never assume that the request will succeed. The server can always return an error status (e.g., 404 or 500). So ensure that the app handles error gracefully.
- Using `UseEffect` runs API requests when the component first loads. The UI renders before the data is returned, so setting a safe initial state (an empty array) is important to prevent errors when handling asynchronous data.
- Adding loading states helped improve UX by giving feedback while data is being fetched.

---

### Phase 2: Authentication and Authorization Mechanisms

#### Authentication Mechanisms

- **Dual Token Mechanism (Access & Refresh Tokens)** - Implementing a dual token system allowed us to balance **security** and **user convenience**. Short-lived **access tokens** provide a limited window for potential attacks, while long-lived **refresh tokens** stored in **HttpOnly cookies** keep users logged in without exposing sensitive data to JavaScript. This approach ensures that users have a seamless experience, minimizing frequent logins, while still maintaining a high level of protection against token theft and XSS attacks. We also learned the importance of handling **token expiration** and **failed refresh attempts** gracefully to prevent unauthorized access and maintain session integrity.

- **Consideration for CAPTCHA** – While working on this project, we also considered potential automated attacks, such as brute-force login attempts or spam registrations. In future iterations, integrating a **CAPTCHA system** could enhance security by ensuring that only human users can perform sensitive actions like logging in, registering, or resetting passwords.

- **Inspired by NestJS @Throttle()** – While learning about NestJS, I discovered the **@Throttle() decorator**, which allows you to limit how many times a client can access a route within a certain time window. This gave me the insight that in the future, we could integrate a similar **rate-limiting mechanism** into our project to prevent brute-force login attempts, spam registrations, or excessive API calls, thereby enhancing the security and robustness of the application.

- **SSO Implementation** - Adding SSO Configuration was relatively difficult, as it needed taking what we already know about it, and having to reconfigure it to match our app type. The app's SSO uses Google's **OAuth 2.0 system**, as it was the most common form of SSO and the easiest to set up due to it being connected to Google, and as such didn't need to go through any other system. Getting it to actually work took some debugging and reorganizing, but it should be fully effective by the next full version release.

- **Token Storage Decisions** - Originally, the plan was to use `localStorage` to store the tokens, as we were already had experience working with it. We started setting it up because we knew we had to store a token outside of state, so a user wouldn't have to login each time they refreshed the page. When we implemented the **refresh token system**, we noticed a trend of using `HttpOnly` cookies to store refresh tokens and storing only **short-lived** access tokens in React State. If either of the tokens were stored in `localStorage`, they were vulnerable to manipulation with JavaScript and defeated the purpose of the **refresh token system**. Using an `HttpOnly` cookie for refresh tokens and keeping access tokens in React state provided the most secure solution.

- **Implementing Token Refresh** - Setting up the token refresh system was one of the more complex parts of authentication. We needed a way to keep users logged in without forcing them to log in again every time the access token expired. This required coordinating both the front-end and back-end so that when a request fails with a `401`, the client automatically attempts to refresh the token using the `/auth/refresh` endpoint and retries the original request. A challenge was making sure users were not logged out unnecessarily, while still enforcing security when the refresh token is no longer valid. This helped create a smoother user experience while still maintaining secure session control.

#### Role-Based Access Control

- **Authentication vs Authorization** - This helped us clearly see how these work together but do different things. Authentication checks if the user is logged in, while authorization controls what they can access. In our case, users could be logged in but still blocked from `/admin` if they weren’t an admin.
- **Frontend vs Backend Security** - We realized that frontend protection is mainly for user experience, not security. Even if a route or button is hidden, users can still try to access it manually. The backend middleware is what actually enforces access control.
- **Middleware Order** - One issue we ran into was making sure middleware runs in the correct order. `authMiddleware` has to run first so `req.user` exists before checking the role. This showed how each step depends on the previous one.
- **Error Handling** - We handled different cases using:
  - `401` - when the user is not authenticated (no or invalid token)
  - `403` - when the user is authenticated but not allowed access
  - This made debugging and testing much clearer.
- **Role-Based UI Behavior** - The admin dashboard button in `Home.jsx` only shows for admin users. This keeps the UI clean and helps prevent regular users from trying to access admin features.
- **Simplicity vs Flexibility** - We kept the system simple with just **User** and **Admin** roles. This made it easier to build and test, but it would need to be expanded if more detailed permissions are needed later.
- **Main Challenge** - The biggest challenge was making sure everything worked together, not just individually. It wasn’t enough to protect routes on the frontend or backend alone. We had to make sure both layers were working together so that even if someone tried to access `/admin` directly, they would still be blocked. Getting this fully working required testing multiple scenarios and fixing small issues between frontend routing and backend checks.
- **Testing Restricted Access** - We tested different edge cases like missing tokens, invalid tokens, and wrong roles. This helped confirm that the system properly blocks unauthorized users and only allows access where it should.

---

### Phase 3: Implementing Security Best Practices

#### Input Validation with Express Validator

- **Express Validator as Middleware** - One of the most useful tools we used in this phase was **Express Validator**. It gave us a structured way to validate and sanitize incoming request data before it reached our controller logic. This helped us keep our routes more secure and easier to maintain.

- **Synchronous and Asynchronous Validation** - A key thing we learned is that Express Validator supports both **synchronous** validation (such as checking whether username is empty, validating email format, or enforcing password length) and **asynchronous** validation (such as checking whether a username or email already exists in the database). This made it flexible enough to handle both simple rules and more realistic application requirements.

- **Keeping Validation Out of Route Parameters** - One important lesson was that validation logic should be organized carefully. Instead of writing large amounts of validation logic directly inside route parameters, we tried to structure validation as reusable **middleware** attached to the routes. This kept the routing layer much cleaner and prevented the routes from becoming difficult to read or maintain.

#### Encryption Considerations

- **Encryption Improves Data Protection** - Encryption is a strong way to protect sensitive user data in storage. It adds an extra layer of security by making the original value unreadable without the correct decryption process, which is especially useful for personal profile information or other private fields.

- **Schema Design Must Consider Encryption Early** - One important lesson we learned is that encryption cannot be treated as something added at the very end of development. When designing a user schema, we need to think carefully from the beginning about which fields should be encrypted, which fields may need to stay searchable, and which fields may need special database constraints such as `unique`.

- **Conflict Between Encryption and Uniqueness** - A major challenge appears when a field needs to be encrypted, must remain unique, and also needs to be editable by the user. Once a value is encrypted, it often cannot be compared in a simple way for uniqueness unless the encryption strategy is designed around that requirement. This means fields such as email addresses or usernames require more planning if we want both privacy and database-level uniqueness.

- **Editability Adds More Complexity** - Allowing users to modify encrypted fields adds another layer of complexity. Each update must ensure that the new value is processed correctly, stored securely, and still checked against any uniqueness requirements. Without this being planned early, the update flow can become difficult to maintain and may introduce bugs or inconsistent data.

- **Performance Trade-offs** - Encryption improves security, but it also adds processing overhead. If too many fields are encrypted, especially in frequently read or updated data, application performance can begin to decline. This reminded us that security design also needs to consider efficiency, and that not every piece of data should be encrypted without evaluating the performance cost.

---

### Phase 4: Security Testing and Ethical and Legal Considerations

- **Early Integration of Security Principles** - Incorporating security considerations from the beginning of development is more effective than attempting to address vulnerabilities after implementation.

- **Importance of Secure Authentication Mechanisms** - The authentication and token management system is a critical component, as it governs access to all protected resources within the application.

- **Necessity of Backend Enforcement** - While frontend protections enhance user experience, true security must be enforced at the backend through validation and authorization mechanisms.

- **Effectiveness of a Layered Security Approach** - Combining multiple security measures, such as input validation, output encoding, and access control, significantly strengthens the overall security posture.

- **Risk-Based Prioritization of Security Efforts** - Focusing on high-impact and high-likelihood threats first allows for more efficient use of development time while ensuring critical vulnerabilities are addressed early.

- **Responsible Security Testing** - Security testing should always be performed within authorized environments. In our case, all OWASP ZAP scans and testing activities were limited to our own application and development setup, which helped us learn safely while respecting ethical boundaries.

- **Importance of Data Privacy from the Start** - Even though the project is still in development and does not yet use real user data, we treated test accounts and sample data with the same level of care as production data. This helped us build stronger privacy habits early in the project lifecycle.

- **Value of Realistic Testing Environments** - Using Docker allowed us to simulate a more realistic server-like environment during development. This gave us better insight into how security configurations and application behavior may perform in production.

- **Ethics Beyond Technical Fixes** - Web security is not only about finding vulnerabilities. It also involves acting responsibly, avoiding misuse of tools, protecting data carefully, and making decisions that build trust with future users.

- **Legal Awareness in Security Work** - Security testing can carry legal implications when performed without permission or when personal data is mishandled. Learning about privacy frameworks such as PIPEDA helped us better understand the legal responsibilities connected to modern web development.
