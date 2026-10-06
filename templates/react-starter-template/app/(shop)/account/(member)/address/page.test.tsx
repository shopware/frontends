import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import AddressesPage, { metadata } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

describe("AddressesPage", () => {
  it("is titled like the Vue address header", () => {
    expect(metadata.title).toBe("Addresses");
  });

  it("renders the header, the add link and the sections, with the addresses loading in the browser", async () => {
    const html = await renderToHtml(<AddressesPage />);

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
});
