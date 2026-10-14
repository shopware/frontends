import { preconnect } from "react-dom";
import { describe, expect, it, vi } from "vitest";

import { renderToHtml } from "@/test/render";

import ShopLayout from "./layout";

vi.mock("server-only", () => ({}));

vi.mock("@/features/layout/components/Header", () => ({
  Header: () => <header>header</header>,
}));

vi.mock("@/features/layout/components/Footer", () => ({
  Footer: () => <footer>footer</footer>,
}));

vi.mock("@/features/layout/components/ResourceHints", () => ({
  ResourceHints: () => {
    preconnect("https://cdn.test");
    preconnect("https://api.test", { crossOrigin: "anonymous" });
    return null;
  },
}));

describe("ShopLayout", () => {
  it("renders the resource hints, which React hoists ahead of the header", async () => {
    const html = await renderToHtml(
      await ShopLayout({
        children: <p>page</p>,
        params: Promise.resolve({ locale: "en-GB" }),
      }),
    );

    const media = html.indexOf(
      '<link rel="preconnect" href="https://cdn.test"/>',
    );
    const storeApi = html.indexOf(
      '<link rel="preconnect" href="https://api.test" crossorigin=""/>',
    );
    expect(media).toBeGreaterThanOrEqual(0);
    expect(storeApi).toBeGreaterThanOrEqual(0);
    expect(Math.max(media, storeApi)).toBeLessThan(html.indexOf("<header>"));
    expect(html).toContain('<main class="flex-1" aria-label="Main content">');
  });
});
