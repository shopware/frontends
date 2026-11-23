import { describe, expect, it } from "vitest";

import { readEmailLinkParams } from "./emailLinkParams";

describe("readEmailLinkParams", () => {
  it("reads the email hash and the hash of the link", () => {
    expect(readEmailLinkParams("?em=abc&hash=def")).toEqual({
      em: "abc",
      hash: "def",
    });
  });

  it.each([
    [""],
    ["?em=abc"],
    ["?hash=def"],
    ["?em=&hash=def"],
    ["?em=abc&hash="],
    ["?em=%20%20&hash=def"],
    ["?em=abc&hash=%09"],
  ])("gives null for %j", (search) => {
    expect(readEmailLinkParams(search)).toBeNull();
  });

  it("takes the first of repeated values and trims them", () => {
    expect(
      readEmailLinkParams("?em=%20abc%20&em=other&hash=def%20&hash=other"),
    ).toEqual({ em: "abc", hash: "def" });
  });

  it("ignores the redirect parameters of the link", () => {
    expect(
      readEmailLinkParams(
        "?em=abc&hash=def&redirectTo=frontend.account.home.page&redirectParameters=%7B%7D&forwardTo=x",
      ),
    ).toEqual({ em: "abc", hash: "def" });
  });
});
