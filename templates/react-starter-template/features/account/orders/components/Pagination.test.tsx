import { describe, expect, it } from "vitest";

import { renderToHtml } from "@/test/render";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("is a labelled navigation with labelled page buttons and the current page marked", async () => {
    const html = await renderToHtml(
      <Pagination total={20} current={10} onChangePage={() => {}} />,
    );

    expect(html).toContain(
      '<nav class="relative z-0 inline-flex space-x-px rounded-md" aria-label="Pagination">',
    );
    expect(html).toContain('aria-label="Previous page"');
    expect(html).toContain('aria-label="Next page"');
    expect(html).toContain('aria-current="page" aria-label="Page 10"');
    expect(html).toContain('aria-label="Page 1"');
    expect(html).toContain('aria-label="Page 20"');
    expect(
      html.match(/aria-hidden="true" class="[^"]*">\.\.\.<\/span>/g),
    ).toHaveLength(2);
  });

  it("disables the arrows at the ends", async () => {
    const first = await renderToHtml(
      <Pagination total={1} current={1} onChangePage={() => {}} />,
    );

    expect(first).toMatch(
      /<button[^>]*disabled=""[^>]*aria-label="Previous page"/,
    );
    expect(first).toMatch(/<button[^>]*disabled=""[^>]*aria-label="Next page"/);
  });
});
