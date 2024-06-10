import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Cookies from "js-cookie";
import { createShopwareContext } from "@shopware-pwa/composables-next/lib";
import { apiClient } from "./apiClient";

apiClient.hook("onContextChanged", (newContextToken) => {
  Cookies.set("sw-context-token", newContextToken, {
    expires: 365, // days
    path: "/",
    sameSite: "lax",
  });
});

const app = createApp(App);

// setup shopware plugin
const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);

// register a plugin in a Vue instance
app.use(shopwareContext);

app.mount("#app");
