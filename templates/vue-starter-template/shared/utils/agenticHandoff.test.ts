import { describe, expect, it } from "vitest";

import { CONTEXT_TOKEN_PATTERN } from "./agenticHandoff";

describe("CONTEXT_TOKEN_PATTERN", () => {
  it.each([
    "0123456789abcdef0123456789abcdef",
    "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6",
  ])("accepts %s", (token) => {
    expect(CONTEXT_TOKEN_PATTERN.test(token)).toBe(true);
  });

  it.each([
    "",
    "a".repeat(31),
    "a".repeat(33),
    `${"a".repeat(31)}-`,
    `${"a".repeat(32)}\n`,
    `../${"a".repeat(29)}`,
  ])("refuses %j", (token) => {
    expect(CONTEXT_TOKEN_PATTERN.test(token)).toBe(false);
  });
});
