import { describe, expect, it } from "vitest";

import { toCssVariables, toJson, toTailwindTheme } from "./formats";

const sample = {
  "brand-primary": "#543B95",
  "overlay-dark": "rgba(0, 0, 0, 0.5)",
};

describe("toTailwindTheme", () => {
  it("declares every color as a static Tailwind theme variable", () => {
    expect(toTailwindTheme(sample)).toBe(
      "@theme static {\n  --color-brand-primary: #543B95;\n  --color-overlay-dark: rgba(0, 0, 0, 0.5);\n}\n",
    );
  });
});

describe("toCssVariables", () => {
  it("declares every color as a custom property on :root", () => {
    expect(toCssVariables(sample)).toBe(
      ":root {\n  --color-brand-primary: #543B95;\n  --color-overlay-dark: rgba(0, 0, 0, 0.5);\n}\n",
    );
  });
});

describe("toJson", () => {
  it("serializes the colors under a colors key", () => {
    expect(JSON.parse(toJson(sample))).toEqual({ colors: sample });
  });
});
