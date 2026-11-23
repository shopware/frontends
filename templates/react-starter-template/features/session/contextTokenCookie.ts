export const CONTEXT_TOKEN_COOKIE = "sw-context-token";

export const CONTEXT_TOKEN_LIFETIME_DAYS = 365;

const DAY_MS = 86_400_000;

export type ContextTokenCookieAttributes = {
  path: "/";
  sameSite: "lax";
  secure: boolean;
};

export function contextTokenCookieAttributes(
  secure: boolean,
): ContextTokenCookieAttributes {
  return { path: "/", sameSite: "lax", secure };
}

export function contextTokenExpiry(now: number = Date.now()): Date {
  return new Date(now + CONTEXT_TOKEN_LIFETIME_DAYS * DAY_MS);
}
