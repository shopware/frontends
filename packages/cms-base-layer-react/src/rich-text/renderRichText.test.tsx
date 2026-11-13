import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { renderRichText } from "./renderRichText";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: Record<string, unknown>) => (
    <a href={String(href)} data-link="internal" {...props}>
      {children as never}
    </a>
  ),
}));

function render(html: string, urlPrefix = "") {
  return renderToStaticMarkup(<>{renderRichText(html, { urlPrefix })}</>);
}

describe("renderRichText", () => {
  it("removes scripts and event handlers", () => {
    const html = render(
      '<p onclick="alert(1)">Hi<script>alert(1)</script></p><img src="x" onerror="alert(1)">',
    );
    expect(html).not.toContain("script");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("onerror");
    expect(html).toContain("<p>Hi</p>");
  });

  it("keeps editor classes, styles and data attributes", () => {
    const html = render(
      '<p class="lead" style="text-align: center" data-id="1">Text</p>',
    );
    expect(html).toContain('class="lead"');
    expect(html).toContain("text-align:center");
    expect(html).toContain('data-id="1"');
  });

  it("turns btn links into token buttons and plain links into underlined links", () => {
    const html = render(
      '<a class="btn btn-primary" href="https://example.com">Buy</a><a href="https://example.com/x">Read</a>',
    );
    expect(html).toContain("bg-brand-primary text-brand-on-primary");
    expect(html).not.toContain("btn-primary");
    expect(html).toContain(
      "underline text-base font-normal text-brand-primary",
    );
  });

  it("renders internal links through next/link with the url prefix", () => {
    const html = render(
      '<a href="en-GB/navigation/abc123">Category</a><a href="/about">About</a>',
      "de-DE",
    );
    expect(html).toContain('href="/de-DE/navigation/abc123"');
    expect(html).toContain('href="/about"');
    expect(html.match(/data-link="internal"/g)).toHaveLength(2);
  });

  it("converts font color to an inline style and lazy-loads images", () => {
    const html = render(
      '<font color="#ce0000">Red</font><img src="https://cdn/x.jpg" alt="x">',
    );
    expect(html).toContain('<span style="color:#ce0000">Red</span>');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
  });
});
