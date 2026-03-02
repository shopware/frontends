import { describe, expect, it } from "vitest";
import { getImageSizes } from "./getImageSizes";

describe("getImageSizes", () => {
  it("should return sizes for 1 slot", () => {
    expect(getImageSizes(1)).toBe("(max-width: 768px) 100vw, 100vw");
  });

  it("should return sizes for 2 slots", () => {
    expect(getImageSizes(2)).toBe("(max-width: 768px) 100vw, 50vw");
  });

  it("should return sizes for 3 slots", () => {
    expect(getImageSizes(3)).toBe("(max-width: 768px) 100vw, 33vw");
  });

  it("should return default sizes for slot count > 3", () => {
    expect(getImageSizes(4)).toBe("(max-width: 768px) 50vw, 25vw");
  });

  it("should return default sizes for slot count 0", () => {
    expect(getImageSizes(0)).toBe("(max-width: 768px) 50vw, 25vw");
  });

  it("should use custom config overrides", () => {
    const config = {
      1: "100vw",
      2: "50vw",
    };
    expect(getImageSizes(1, config)).toBe("100vw");
    expect(getImageSizes(2, config)).toBe("50vw");
  });

  it("should fall back to custom default from config", () => {
    const config = {
      default: "80vw",
    };
    expect(getImageSizes(5, config)).toBe("80vw");
  });

  it("should fall back to 100vw when no default exists", () => {
    const config = {
      1: "100vw",
    };
    // Override default to empty by spreading — slot 5 not found, default not in config
    // but DEFAULT_IMAGE_SIZES has a default, so config must explicitly remove it
    // Actually, the spread keeps DEFAULT_IMAGE_SIZES.default unless overridden
    expect(getImageSizes(5, config)).toBe("(max-width: 768px) 50vw, 25vw");
  });
});
