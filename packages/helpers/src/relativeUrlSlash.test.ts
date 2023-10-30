import { describe, expect, it } from "vitest";
import { relativeUrlSlash } from "./relativeUrlSlash";

const relativeWithSlash = "/test";
const relativeWithoutSlash = "test";

describe("relativeUrlSlash", () => {
  it("relative url with slash", async () => {
    expect(relativeUrlSlash(relativeWithSlash)).toBe(relativeWithSlash);
    expect(relativeUrlSlash(relativeWithoutSlash)).toBe(relativeWithSlash);
  });
  it("relative url without slash", async () => {
    expect(relativeUrlSlash(relativeWithSlash, false)).toBe(
      relativeWithoutSlash,
    );
    expect(relativeUrlSlash(relativeWithoutSlash, false)).toBe(
      relativeWithoutSlash,
    );
  });
});
