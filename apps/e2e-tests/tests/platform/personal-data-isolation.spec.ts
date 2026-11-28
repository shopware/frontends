import type { Page } from "@playwright/test";

import { test as base, expect } from "../../fixtures";
import { CartPage } from "../../page-objects/CartPage";
import { HomePage } from "../../page-objects/HomePage";

const PERSONAL_ROUTES = [
  "/checkout",
  "/checkout/cart",
  "/account",
  "/account/order",
  "/wishlist",
];
const LOCALE_PREFIXES = ["/de-DE", "/pl-PL"];

const test = base.extend<{ visitor: Page }>({
  visitor: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(await context.newPage());
    await context.close();
  },
});

test.describe(
  "Personal data isolation",
  { tag: ["@frontends", "@writes-customer"] },
  () => {
    test.setTimeout(240_000);

    test("a signed-in customer's name, email and cart never reach another visitor", async ({
      customer,
      homePage,
      productPage,
      cartPage,
      request,
      visitor,
    }) => {
      await homePage.loginAs(customer.email, customer.password);
      await homePage.visit("/account");
      await expect(homePage.content).toContainText(customer.email, {
        timeout: 30_000,
      });
      await homePage.openFirstCategoryPage();
      const categoryPath = new URL(homePage.page.url()).pathname;
      await homePage.openFirstProductPage();
      const productPath = new URL(homePage.page.url()).pathname;
      await productPage.addToCart();
      await expect(cartPage.miniCartButton).toContainText(/[1-9]/, {
        timeout: 30_000,
      });

      const prefixes = [""];
      for (const prefix of LOCALE_PREFIXES) {
        if ((await request.get(prefix)).ok()) prefixes.push(prefix);
      }
      const paths = [
        categoryPath,
        productPath,
        ...prefixes.flatMap((prefix) =>
          PERSONAL_ROUTES.map((route) => `${prefix}${route}`),
        ),
      ];

      for (const path of paths) await homePage.visit(path);

      const visitorHome = new HomePage(visitor);
      const visitorCart = new CartPage(visitor);
      const personalData = [
        customer.email,
        customer.firstName,
        customer.lastName,
      ];

      for (const path of paths) {
        const html = await (await visitorHome.visit(path)).text();
        for (const value of personalData) {
          expect(html, `${path} delivered "${value}"`).not.toContain(value);
          await expect(visitorHome.content, path).not.toContainText(value);
        }
        await expect(visitorHome.signedIn, path).toHaveCount(0);
        await expect(
          visitorCart.miniCartButton.filter({ hasText: /[1-9]/ }),
          path,
        ).toHaveCount(0);
      }
    });
  },
);
