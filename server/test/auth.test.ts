import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

const password = "correct-horse-battery";

function register(username: string) {
  return request(app)
    .post("/api/auth/register")
    .send({
      username,
      password,
      first_name: "Test",
      last_name: "User",
      email: `${username}@example.com`,
    });
}

// The refresh cookie is `Secure`, and supertest talks plain HTTP, so a cookie jar would
// silently drop it. Pull it out of Set-Cookie and send it back by hand instead.
function refreshCookie(res: request.Response): string {
  const setCookie = ([] as string[]).concat(res.headers["set-cookie"] ?? []);
  const jwt = setCookie.find((c) => c.startsWith("jwt="));
  expect(jwt, "response should set the jwt refresh cookie").toBeDefined();
  expect(jwt).toMatch(/HttpOnly/i);
  return jwt!.split(";")[0];
}

describe("register → login → refresh", () => {
  it("issues an access token at each step for the same user", async () => {
    const registered = await register("alice");
    expect(registered.status).toBe(201);
    expect(registered.body.accessToken).toEqual(expect.any(String));
    expect(registered.body.user).toMatchObject({
      username: "alice",
      email: "alice@example.com",
      role: "user",
    });
    expect(registered.body.user).not.toHaveProperty("password");

    const loggedIn = await request(app)
      .post("/api/auth/login")
      .send({ username: "alice", password });
    expect(loggedIn.status).toBe(200);
    expect(loggedIn.body.accessToken).toEqual(expect.any(String));

    const refreshed = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", refreshCookie(loggedIn));
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.accessToken).toEqual(expect.any(String));
    expect(refreshed.body.user.id).toBe(registered.body.user.id);
  });
});

describe("admin routes", () => {
  it("returns 401 to a request with no token", async () => {
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(401);
  });

  it("returns 403 to an authenticated non-admin", async () => {
    const { body } = await register("bob");
    const res = await request(app)
      .get("/api/admin/users")
      .set("token", body.accessToken);
    expect(res.status).toBe(403);
  });
});
