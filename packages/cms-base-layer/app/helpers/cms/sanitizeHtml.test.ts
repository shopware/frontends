import { describe, expect, it } from "vitest";

import { sanitizeHtml } from "./sanitizeHtml";

describe("sanitizeHtml", () => {
  it("returns an empty string for empty input", () => {
    expect(sanitizeHtml(undefined)).toBe("");
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml("")).toBe("");
  });

  it("removes script and style together with their content", () => {
    expect(
      sanitizeHtml(
        "<p>a</p><script>alert(1)</script><style>p{color:red}</style><p>b</p>",
      ),
    ).toBe("<p>a</p><p>b</p>");
  });

  it("strips tags outside the whitelist instead of escaping them", () => {
    const result = sanitizeHtml(
      '<iframe src="https://example.com/embed"></iframe><form><input name="q"><button>go</button></form><p>text</p>',
    );

    expect(result).not.toContain("&lt;");
    expect(result).not.toContain("<iframe");
    expect(result).not.toContain("<form");
    expect(result).toContain("<p>text</p>");
  });

  it("keeps entity-escaped markup as text", () => {
    expect(sanitizeHtml("<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>")).toBe(
      "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
    );
  });

  it.each([
    "kontakt",
    "?page=2",
    "sms:+123",
    "#anchor",
    "/path",
    "./relative",
    "https://example.com/?a=1&amp;b=2",
    "mailto:a@b.c",
    "tel:+123",
  ])("keeps a safe href (%s)", (href) => {
    expect(sanitizeHtml(`<a href="${href}">l</a>`)).toBe(
      `<a href="${href}">l</a>`,
    );
  });

  it("keeps a relative image src", () => {
    expect(sanitizeHtml('<img src="media/a.png">')).toBe(
      '<img src="media/a.png">',
    );
  });

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "javascript&colon;alert(1)",
    "java&Tab;script:alert(1)",
    "java&NewLine;script:alert(1)",
    "java&#x0A;script:alert(1)",
    "&#106;avascript:alert(1)",
    "data:text/html,x",
  ])("drops an unsafe href (%s)", (href) => {
    expect(sanitizeHtml(`<a href="${href}">l</a>`)).toBe("<a>l</a>");
  });

  it("removes event handlers and attributes outside the whitelist", () => {
    expect(sanitizeHtml('<p onclick="x()" class="c" href="/x">t</p>')).toBe(
      "<p>t</p>",
    );
  });
});
