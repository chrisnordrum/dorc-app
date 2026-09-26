import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    setupFiles: ["test/setup.ts"],
    // Starting mongod can outlast the default 10s on a cold CI runner.
    hookTimeout: 60_000,
    // Throwaway values so the suite never needs a .env. The encryption secrets must be
    // exactly 16 bytes (AES-128). GOOGLE_CLIENT_ID only has to be non-empty — the
    // passport strategy throws on require without it.
    env: {
      ACCESS_TOKEN_SECRET: "test-access-token-secret",
      REFRESH_TOKEN_SECRET: "test-refresh-token-secret",
      SESSION_SECRET: "test-session-secret",
      EMAIL_ENCRYPTION_SECRET: "0123456789abcdef",
      BIO_ENCRYPTION_SECRET: "fedcba9876543210",
      GOOGLE_CLIENT_ID: "test-google-client-id",
      GOOGLE_CLIENT_SECRET: "test-google-client-secret",
    },
  },
});
