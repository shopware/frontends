import { createShopwareContext } from "@shopware/composables";

const shopware = createShopwareContext(app, {
  cacheableReads: true,
});
app.use(shopware);
