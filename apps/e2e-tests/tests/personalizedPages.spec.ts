import { expect, test } from "../fixtures";

// Route rules match raw paths and know nothing about i18n. A personalized page
// without its rule under a locale prefix is server-rendered and cached under
// the catch-all ISR rule.
const PAGES = [
  "/checkout",
  "/checkout/cart",
  "/account",
  "/account/order",
  "/wishlist",
];
const PREFIXES = ["", "/de-DE", "/pl-PL"];

test.describe("Personalized pages", { tag: "@frontends" }, () => {
  for (const prefix of PREFIXES) {
    test(`are client-rendered and uncached under "${prefix || "/"}"`, async ({
      request,
    }) => {
      for (const page of PAGES) {
        const path = `${prefix}${page}`;
        const response = await request.get(path, { maxRedirects: 0 });

        expect(response.status(), path).toBe(200);
        expect(response.headers()["cache-control"], path).toContain("no-store");
        expect(response.headers()["surrogate-control"], path).toBe("no-store");
        expect(await response.text(), path).toContain('data-ssr="false"');
      }
    });
  }

  test("a localized catalog page keeps server rendering and its cache", async ({
    request,
  }) => {
    // Server rendering reads from the shared demo backend, which rate-limits.
    await expect(async () => {
      const response = await request.get("/de-DE", { maxRedirects: 0 });

      expect(response.status()).toBe(200);
      expect(response.headers()["surrogate-control"]).toContain("max-age=");
      expect(await response.text()).toContain('data-ssr="true"');
    }).toPass({ intervals: [5_000, 10_000, 20_000], timeout: 45_000 });
  });
});
