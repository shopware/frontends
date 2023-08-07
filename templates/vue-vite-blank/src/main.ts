import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createShopwareContext } from "@shopware-pwa/composables-next";
import { createInstance } from "@shopware-pwa/api-client";

const apiInstance = createInstance({
  endpoint: import.meta.env.VITE_DEMO_API_URL,
  accessToken: import.meta.env.VITE_DEMO_API_ACCESS_TOKEN,
});

const app = createApp(App);

// setup shopware plugin
const shopwareContext = createShopwareContext(app, {
  apiInstance,
  // devStorefrontUrl: "https://your-sales-channel-configured-domain.com",
});

// register a plugin in a Vue instance
app.use(shopwareContext);

app.mount("#app");
