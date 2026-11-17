import { describe, expect, it } from "vitest";

import { getVariantOptionKeyAction } from "./variantOptionKeyboard";

describe("getVariantOptionKeyAction", () => {
  it("only marks an option on arrow keys", () => {
    for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
      expect(getVariantOptionKeyAction(key, false)).toBe("mark");
      expect(getVariantOptionKeyAction(key, true)).toBe("mark");
    }
  });

  it("commits a marked option on Enter and Space", () => {
    expect(getVariantOptionKeyAction("Enter", true)).toBe("commit");
    expect(getVariantOptionKeyAction(" ", true)).toBe("commit");
  });

  it("ignores Enter and Space without a marked option, and other keys", () => {
    expect(getVariantOptionKeyAction("Enter", false)).toBeUndefined();
    expect(getVariantOptionKeyAction(" ", false)).toBeUndefined();
    expect(getVariantOptionKeyAction("Tab", true)).toBeUndefined();
  });
});
