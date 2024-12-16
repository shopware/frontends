import { createApp } from "vue";
import "./style.css";
import { createShopwareContext } from "@shopware-pwa/composables-next/lib";
import App from "./App.vue";
import { apiClient } from "./apiClient";

const app = createApp(App);

// setup shopware plugin
const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);

// register a plugin in a Vue instance
app.use(shopwareContext);

app.mount("#app");
