import { createShopwareContext } from "#imports";

const shopwareContext = createShopwareContext(app, {
  enableDevtools: !!options.enableDevtools, // decide if devtools should be enabled
});
