import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { AccountOverview } from "./AccountOverview";

describe("AccountOverview on the server", () => {
  it("renders the page header and the busy skeleton without customer data", async () => {
    const html = await renderToHtml(<AccountOverview />);

    expect(html).toContain(
      '<h1 class="font-serif text-[40px] leading-15 text-surface-on-surface">Overview</h1>',
    );
    expect(html).toContain(
      ">Directly access your profile information, the default payment method and given addresses.</p>",
    );
    expect(html).toMatch(
      /<div aria-busy="true" data-testid="account-overview-skeleton"/,
    );
    expect(html).toContain('<output class="sr-only">Loading...</output>');
    expect(html).not.toContain("<h2");
    expect(html).not.toContain('id="newsletter-checkbox"');
    expect(html).not.toContain('role="alert"');
  });
});

describe("AccountOverview on the server in German", () => {
  it("renders the German page header and loading text", async () => {
    const html = await renderToHtml(withI18n(<AccountOverview />, "de-DE"));

    expect(html).toContain(">Übersicht</h1>");
    expect(html).toContain('<output class="sr-only">Lädt...</output>');
  });
});
