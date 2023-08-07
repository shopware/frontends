import { describe, expect, it } from "vitest";
import { urlIsAbsolute } from "./urlIsAbsolute";

const absoluteUrl = "http://www.test.test";
const notAbsoluteUrl = "/test";

describe("urlIsAbsolute", () => {
  it("url is absolute", async () => {
    expect(urlIsAbsolute(absoluteUrl)).toBe(true);
  });
  it("url is not absolute", async () => {
    expect(urlIsAbsolute(notAbsoluteUrl)).toBe(false);
  });
});
