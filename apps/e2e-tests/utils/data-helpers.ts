import { randomBytes } from "node:crypto";

/** Must not collide with customers an earlier run created on the shared backend. */
export function uniqueEmail() {
  const unique = `${Date.now().toString(36)}${randomBytes(4).toString("hex")}`;
  return `e2e-${unique}@example.com`;
}

/** From a CSPRNG: a Math.random() password reads as a weak secret to scanners. */
export function uniquePassword() {
  return `e2e-${randomBytes(12).toString("base64url")}`;
}
