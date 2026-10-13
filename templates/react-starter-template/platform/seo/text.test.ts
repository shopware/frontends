import { describe, expect, it } from "vitest";

import { toPlainText, truncate } from "./text";

describe("toPlainText", () => {
  it("strips tags, decodes entities and collapses whitespace", () => {
    expect(
      toPlainText(
        "<p>Oak &amp; ash</p>\n<p>&lt;b&gt; &#252;ber&nbsp;&#x41;</p>",
      ),
    ).toBe("Oak & ash <b> über A");
  });

  it("keeps unknown entities and handles empty input", () => {
    expect(toPlainText("a &unknown; b")).toBe("a &unknown; b");
    expect(toPlainText("a &#x110000; &#99999999; b")).toBe(
      "a &#x110000; &#99999999; b",
    );
    expect(toPlainText(undefined)).toBe("");
  });
});

describe("truncate", () => {
  it("cuts long text with an ellipsis within the limit", () => {
    expect(truncate("abcdefghij", 5)).toBe("abcd…");
    expect(truncate("abc de", 5)).toBe("abc…");
    expect(truncate("short", 5)).toBe("short");
  });
});
