import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { SwPagination } from "./SwPagination";

const pageButtons = (html: string) =>
  html.match(/<span class="sr-only">Page <\/span>(?:<!-- -->)?\d+/g) ?? [];

describe("SwPagination", () => {
  it("renders the first page with only the next controls", async () => {
    const html = await renderToHtml(
      <SwPagination total={3} current={1} onChangePage={() => {}} />,
    );

    expect(html).toContain('aria-label="Pagination"');
    expect(html).toContain('aria-current="page"');
    expect(html).not.toContain("Previous");
    expect(html).toContain("Next");
    expect(pageButtons(html)).toHaveLength(2);
    expect(html).toContain(">3</button>");
    expect(html).not.toContain("...");
  });

  it("renders ellipses, the first and the last page around a middle page", async () => {
    const html = await renderToHtml(
      <SwPagination total={10} current={5} onChangePage={() => {}} />,
    );

    expect(html).toContain("Previous");
    expect(html).toContain("Next");
    expect(html.match(/\.\.\./g)).toHaveLength(2);
    expect(pageButtons(html)).toHaveLength(4);
    expect(html).toContain(">10</button>");
  });

  it("rounds the right corner on the last page and uses the translations", async () => {
    const html = await renderToHtml(
      <SwPagination
        total={2}
        current={2}
        translations={{ listing: { previous: "Zurück", next: "Weiter" } }}
        onChangePage={() => {}}
      />,
    );

    expect(html).toContain("rounded-r-md");
    expect(html).not.toContain("Zurück");
    expect(html).not.toContain("Weiter");
    expect(html).toContain('<span class="sr-only">Page </span>');
  });
});
