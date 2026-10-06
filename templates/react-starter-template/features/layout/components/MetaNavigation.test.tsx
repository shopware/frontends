import { describe, expect, it } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import { MetaNavigation } from "./MetaNavigation";

describe("MetaNavigation", () => {
  it("renders the language switcher closed, labelled in the page locale", async () => {
    const html = await renderToHtml(withI18n(<MetaNavigation />, "pl-PL"));

    expect(html).toContain("bg-surface-surface-primary");
    expect(html).toMatch(/<button type="button" aria-expanded="false"/);
    expect(html).toContain('<span class="sr-only">Zmień język<!-- -->:');
    expect(html).toContain('<span lang="pl-PL">Polski</span>');
    expect(html).not.toContain("<ul");
  });

  it("names the current language in English on the default locale", async () => {
    const html = await renderToHtml(withI18n(<MetaNavigation />));

    expect(html).toContain("Change language");
    expect(html).toContain('<span lang="en-GB">English</span>');
  });
});
