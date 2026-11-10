import { describe, expect, it } from "vitest";

import { colors, designTokenTheme } from "./index";

describe("designTokenTheme", () => {
  it("exposes the colors object", () => {
    expect(designTokenTheme.colors).toBe(colors);
  });
});

describe("colors", () => {
  it("holds only hex or rgba values", () => {
    for (const value of Object.values(colors)) {
      expect(value).toMatch(/^(#[0-9A-F]{6}|rgba\(\d+, \d+, \d+, [\d.]+\))$/i);
    }
  });

  it("uses kebab-case token names", () => {
    for (const name of Object.keys(colors)) {
      expect(name).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});
