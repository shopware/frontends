import { describe, expect, it, vi } from "vitest";

import { withI18n } from "@/test/i18n";
import { renderToHtml } from "@/test/render";

import AddressesPage, { generateMetadata } from "./page";

vi.mock("server-only", () => ({}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const params = (locale: string) => Promise.resolve({ locale });

describe("AddressesPage", () => {
  it("is titled like the Vue address header in the page locale", async () => {
    expect(await generateMetadata({ params: params("en-GB") })).toEqual({
      title: "Addresses",
    });
    expect(await generateMetadata({ params: params("pl-PL") })).toEqual({
      title: "Adresy",
    });
  });

  it("renders the header, the add link and the sections, with the addresses loading in the browser", async () => {
    const html = await renderToHtml(<AddressesPage params={params("en-GB")} />);

    expect(html).toMatch(/<h1\b[^>]*>Addresses<\/h1>/);
    expect(html).toContain(
      "View your current default addresses or add new ones.",
    );
    expect(html).toMatch(
      /<a\b[^>]*href="\/account\/address\/new"[^>]*>\+ <!-- -->Add new address<\/a>/,
    );
    expect(html).toMatch(/<h2\b[^>]*>Default billing address<\/h2>/);
    expect(html).toMatch(/<h2\b[^>]*>Default shipping address<\/h2>/);
    expect(html).toMatch(/<h2\b[^>]*>Available addresses<\/h2>/);
    expect(html).toContain('data-testid="loading"');
    expect(html).not.toContain("Delete address");
  });

  it("renders the Polish copy and a prefixed add link under pl-PL", async () => {
    const html = await renderToHtml(
      withI18n(<AddressesPage params={params("pl-PL")} />, "pl-PL"),
    );

    expect(html).toMatch(/<h1\b[^>]*>Adresy<\/h1>/);
    expect(html).toMatch(
      /<a\b[^>]*href="\/pl-PL\/account\/address\/new"[^>]*>\+ <!-- -->Dodaj nowy adres<\/a>/,
    );
    expect(html).toMatch(/<h2\b[^>]*>Dostępne adresy<\/h2>/);
  });
});
