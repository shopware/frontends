import { describe, expect, it } from "vitest";
import { createApp } from "vue";
import { createShopwareContext } from "./createShopwareContext";

describe("createShopwareContext", () => {
  it("should create a Shopware context with default options", () => {
    const app = createApp({});
    const context = createShopwareContext(app, {});
    context.install(app);
    expect(context).toBeDefined();
  });

  it("should create a Shopware context with custom options", () => {
    const app = createApp({});
    const options = {
      devStorefrontUrl: "https://devstorefront.com",
      enableDevtools: true,
    };
    const context = createShopwareContext(app, options);

    expect(context).toBeDefined();
  });
});
