import { describe, expect, it } from "vitest";

import { toTailwindTheme } from "./formats";

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
