import { getCmsTranslate } from "./getCmsTranslate";
import { describe, expect, it } from "vitest";

describe("useCmsTranslate", () => {
  it("should replace placeholder with param value", async () => {
    expect(getCmsTranslate("Hello, {name}!", { name: "world" })).toBe(
      "Hello, world!",
    );
  });

  it("should return placeholder if param is missing", async () => {
    expect(getCmsTranslate("Hello, {name}!", {})).toBe("Hello, {name}!");
  });

  it("should return text without placeholder (params added)", async () => {
    expect(getCmsTranslate("Hello, world!", { name: "world" })).toBe(
      "Hello, world!",
    );
  });

  it("should return text without placeholder (params missing)", async () => {
    expect(getCmsTranslate("Hello, world!")).toBe("Hello, world!");
  });
});
