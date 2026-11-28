import { expect } from "@playwright/test";

import {
  type Customer,
  type StoreApi,
  captureStoreApi,
  registerCustomer,
} from "../utils/store-api";
import { test as base } from "./diagnostics";

export const test = base.extend<{
  storeApi: { value?: StoreApi };
  customer: Customer;
  guidanceBanner: void;
}>({
  storeApi: [
    async ({ page }, use) => {
      await use(captureStoreApi(page));
    },
    { auto: true },
  ],

  customer: [
    async ({ page, storeApi }, use) => {
      if (!page.url().startsWith("http")) await page.goto("/");
      await expect
        .poll(() => storeApi.value, {
          message:
            "The storefront sent no store-api request with an access key.",
          timeout: 30_000,
        })
        .toBeTruthy();
      await use(await registerCustomer(page, storeApi));
    },
    { timeout: 120_000 },
  ],

  guidanceBanner: [
    async ({ page }, use, testInfo) => {
      if (!testInfo.tags.includes("@accessibility")) {
        await page.addInitScript(() => {
          window.localStorage.setItem(
            "shopware-guidance-banner-dismissed",
            "true",
          );
        });
      }
      await use();
    },
    { auto: true },
  ],
});
