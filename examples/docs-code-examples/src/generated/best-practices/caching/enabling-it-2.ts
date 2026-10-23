import { createShopwareContext } from "@shopware/composables";
import { createApp, ref } from "vue";

const app = createApp({});
const shopware = createShopwareContext(app, {
  cacheableReads: true,
});
app.use(shopware);
// app-wide session and cart, so cacheable reads can check them
app.provide("swSessionContext", ref());
app.provide("swCart", ref());
