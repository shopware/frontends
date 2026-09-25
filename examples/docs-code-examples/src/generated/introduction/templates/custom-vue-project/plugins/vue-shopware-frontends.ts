import type { App } from "vue";

export type ShopwareFrontendsOptions = {
  endpoint: string;
  accessToken: string;
  apiDefaults?: Record<string, unknown>;
};

export default {
  install(app: App, options: ShopwareFrontendsOptions) {
    app.provide("shopwareOptions", options);
  },
};
