import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
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

describe("Pagination in German", () => {
  it("labels the navigation and the page buttons in German", async () => {
    const html = await renderToHtml(
      withI18n(
        <Pagination total={3} current={2} onChangePage={() => {}} />,
        "de-DE",
      ),
    );

    expect(html).toContain('aria-label="Seitennummerierung"');
    expect(html).toContain('aria-label="Vorherige Seite"');
    expect(html).toContain('aria-label="Nächste Seite"');
    expect(html).toContain('aria-current="page" aria-label="Seite 2"');
  });
});
