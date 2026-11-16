import { describe, expect, it } from "vitest";

import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it.each([
    '<a href="javascript:alert(1)">x</a>',
    '<a href="&#106;avascript:alert(1)">x</a>',
    '<a href="&#x6A;avascript:alert(1)">x</a>',
    '<a href="javascript&colon;alert(1)">x</a>',
    '<a href="java&#x09;script:alert(1)">x</a>',
    '<a href="java&NewLine;script:alert(1)">x</a>',
    '<a href=" JAVASCRIPT:alert(1)">x</a>',
    '<a href="data:text/html,<script>alert(1)</script>">x</a>',
    '<a href="vbscript:msgbox(1)">x</a>',
  ])("drops an unsafe href: %s", (html) => {
    const result = sanitizeHtml(html);
    expect(result).not.toMatch(/href="[^"]+"/);
    expect(result.toLowerCase()).not.toContain("script:");
  });

  it.each([
    ["https://example.com/a?b=1&c=2", "https://example.com/a?b=1&c=2"],
    ["mailto:info@example.com", "mailto:info@example.com"],
    ["tel:+49123", "tel:+49123"],
    ["/relative/path", "/relative/path"],
    ["navigation/abc123", "navigation/abc123"],
    ["#anchor", "#anchor"],
  ])("keeps a safe href: %s", (href, expected) => {
    expect(sanitizeHtml(`<a href="${href}">x</a>`)).toBe(
      `<a href="${expected}">x</a>`,
    );
  });
});
