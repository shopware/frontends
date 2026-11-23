import { describe, expect, it } from "vitest";

import {
  CONTEXT_TOKEN_COOKIE,
  CONTEXT_TOKEN_LIFETIME_DAYS,
  contextTokenCookieAttributes,
  contextTokenExpiry,
} from "./contextTokenCookie";

describe("context token cookie", () => {
  it("is the year-long sw-context-token cookie of the Vue starter", () => {
    expect(CONTEXT_TOKEN_COOKIE).toBe("sw-context-token");
    expect(CONTEXT_TOKEN_LIFETIME_DAYS).toBe(365);
  });

  it("is lax for the whole site and secure only when asked", () => {
    expect(contextTokenCookieAttributes(true)).toEqual({
      path: "/",
      sameSite: "lax",
      secure: true,
    });
    expect(contextTokenCookieAttributes(false)).toEqual({
      path: "/",
      sameSite: "lax",
      secure: false,
    });
  });

  it("expires 365 days from now, the date js-cookie computes for expires: 365", () => {
    const now = Date.UTC(2026, 0, 1, 12, 30);

    expect(contextTokenExpiry(now).toISOString()).toBe(
      "2027-01-01T12:30:00.000Z",
    );
    expect(contextTokenExpiry(now).getTime()).toBe(
      new Date(now + 365 * 864e5).getTime(),
    );
  });

  it("counts from the current time by default", () => {
    const before = Date.now();
    const expiry = contextTokenExpiry().getTime();
    const after = Date.now();

    expect(expiry).toBeGreaterThanOrEqual(before + 365 * 864e5);
    expect(expiry).toBeLessThanOrEqual(after + 365 * 864e5);
  });
});
