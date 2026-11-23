import { htmlToDOM } from "html-react-parser";
import { describe, expect, it } from "vitest";

import { isSafeUrl, sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it.each([
    '<a href="javascript:alert(1)">x</a>',
    '<a href="&#106;avascript:alert(1)">x</a>',
    '<a href="&#x6A;avascript:alert(1)">x</a>',
    '<a href="&#0000106;&#0000097;vascript:alert(1)">x</a>',
    '<a href="&#X6a;&#X61;vascript:alert(1)">x</a>',
    '<a href="javascript&colon;alert(1)">x</a>',
    '<a href="javascript&#58;alert(1)">x</a>',
    '<a href="javascript&#x3A;alert(1)">x</a>',
    '<a href="java&#x09;script:alert(1)">x</a>',
    '<a href="java&Tab;script:alert(1)">x</a>',
    '<a href="java&NewLine;script:alert(1)">x</a>',
    '<a href="java&Tab;script&colon;alert(1)">x</a>',
    '<a href="&Tab;javascript:alert(1)">x</a>',
    '<a href="&#1;javascript:alert(1)">x</a>',
    '<a href="java\tscript:alert(1)">x</a>',
    '<a href="java\nscript:alert(1)">x</a>',
    '<a href=" JAVASCRIPT:alert(1)">x</a>',
    '<a href="JaVaScRiPt:alert(1)">x</a>',
    '<a href="  jAvA&Tab;sCrIpT&colon;alert(1)">x</a>',
    '<a href="data:text/html,<script>alert(1)</script>">x</a>',
    '<a href="data&colon;text/html;base64,PHNjcmlwdD4=">x</a>',
    '<a href="vbscript:msgbox(1)">x</a>',
    '<a href="vb&Tab;script&colon;msgbox(1)">x</a>',
  ])("drops an unsafe href: %s", (html) => {
    const result = sanitizeHtml(html);
    expect(result).not.toMatch(/href=/);
    expect(result).toBe("<a>x</a>");
  });

  it.each([
    '<img src="javascript:alert(1)">',
    '<img src="java&Tab;script&colon;alert(1)">',
    '<img src="&#x6A;avascript:alert(1)">',
    '<img src="data:text/html,<script>alert(1)</script>">',
    '<img src="data:image/svg+xml,<svg onload=alert(1)>">',
    '<iframe src="java&NewLine;script:alert(1)"></iframe>',
  ])("drops an unsafe src: %s", (html) => {
    expect(sanitizeHtml(html)).not.toMatch(/src=/);
  });

  it.each([
    ["https://example.com/a?b=1&c=2", "https://example.com/a?b=1&amp;c=2"],
    ["https://example.com/a?b=1&amp;c=2", "https://example.com/a?b=1&amp;c=2"],
    ["mailto:info@example.com", "mailto:info@example.com"],
    ["tel:+49123", "tel:+49123"],
    ["sms:+49123", "sms:+49123"],
    ["/relative/path", "/relative/path"],
    ["navigation/abc123", "navigation/abc123"],
    ["kontakt", "kontakt"],
    ["?page=2", "?page=2"],
    ["#anchor", "#anchor"],
    ["../up", "../up"],
  ])("keeps a safe href: %s", (href, expected) => {
    expect(sanitizeHtml(`<a href="${href}">x</a>`)).toBe(
      `<a href="${expected}">x</a>`,
    );
  });

  it.each([
    "media/image.jpg",
    "./image.png",
    "/media/image.webp",
    "https://cdn.example.com/a.jpg",
    "data:image/png;base64,iVBORw0KGgo=",
  ])("keeps a safe image src: %s", (src) => {
    expect(sanitizeHtml(`<img src="${src}">`)).toBe(`<img src="${src}">`);
  });

  it("decodes in attribute mode, so a legacy entity name is not decoded before `=`", () => {
    expect(
      sanitizeHtml('<a href="https://example.com/?a=1&copy=2">x</a>'),
    ).toBe('<a href="https://example.com/?a=1&amp;copy=2">x</a>');
  });

  it("does not let a decoded quote break out of the attribute", () => {
    const result = sanitizeHtml(
      '<a href="&quot; onmouseover=alert(1) x=&quot;">x</a>',
    );
    const nodes = htmlToDOM(result);
    expect(nodes).toHaveLength(1);
    expect((nodes[0] as { attribs?: Record<string, string> }).attribs).toEqual({
      href: '" onmouseover=alert(1) x="',
    });
    expect(result).toBe('<a href="&quot; onmouseover=alert(1) x=&quot;">x</a>');
  });

  it.each(['<div href="/x">t</div>', '<p src="/x.jpg">t</p>'])(
    "strips href and src from tags that do not allow them: %s",
    (html) => {
      expect(sanitizeHtml(html)).not.toMatch(/(?:href|src)=/);
    },
  );

  it("keeps the extra attributes and data-* attributes", () => {
    expect(
      sanitizeHtml(
        '<p class="a" style="color:red" data-id="x&amp;y" onclick="alert(1)">t</p>',
      ),
    ).toBe('<p class="a" style="color:red" data-id="x&amp;y">t</p>');
  });

  it("keeps whitelisted iframes with a safe src", () => {
    expect(
      sanitizeHtml(
        '<iframe src="https://www.youtube.com/embed/x" allowfullscreen></iframe>',
      ),
    ).toBe(
      '<iframe src="https://www.youtube.com/embed/x" allowfullscreen></iframe>',
    );
  });
});

describe("isSafeUrl", () => {
  it("allows only http(s) and image data URLs as src schemes", () => {
    expect(isSafeUrl("mailto:a@b.c", "src")).toBe(false);
    expect(isSafeUrl("mailto:a@b.c", "href")).toBe(true);
    expect(isSafeUrl("data:image/jpeg;base64,AAA", "src")).toBe(true);
    expect(isSafeUrl("data:image/jpeg;base64,AAA", "href")).toBe(false);
  });
});
