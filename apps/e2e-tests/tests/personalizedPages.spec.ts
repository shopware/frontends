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
    test(`carry their route rule under "${prefix || "/"}"`, async ({
      request,
    }) => {
      for (const page of PAGES) {
        const response = await request.get(`${prefix}${page}`);

        expect(
          response.headers()["surrogate-control"],
          `${prefix}${page}`,
        ).toBe("no-store");
      }
    });
  }
});
