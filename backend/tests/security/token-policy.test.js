import { describe, expect, it } from "vitest";
import "../setup-env.js";

const { env } = await import("../../src/config/env.js");
const { accessCookieOptions } = await import("../../src/utils/cookies.js");

describe("Token and cookie policy", () => {
  it("enforces exact 10 minute access token ttl", () => {
    expect(env.JWT_ACCESS_TTL).toBe("10m");
  });

  it("enforces 10 minute access cookie max-age", () => {
    const options = accessCookieOptions();
    expect(options.maxAge).toBe(10 * 60 * 1000);
    expect(options.httpOnly).toBe(true);
    expect(options.sameSite).toBe("strict");
  });
});
