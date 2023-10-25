import { createApp, ref } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import { createInstance } from "@shopware-pwa/api-client";
import Cookies from "js-cookie";

import App from "./App.vue";

const cookieContextToken = Cookies.get("sw-context-token");
const cookieLanguageId = Cookies.get("sw-language-id");

const contextToken = ref(cookieContextToken);
const languageId = ref(cookieLanguageId);

const app = createApp(App);

const apiInstance = createInstance({
  endpoint: import.meta.env.VITE_SHOPWARE_API,
  accessToken: import.meta.env.VITE_SHOPWARE_ACCESS_KEY,
  contextToken: contextToken.value,
  languageId: languageId.value,
});

apiInstance.onConfigChange(({ config }) => {
  // set the context-token in the cookie
  Cookies.set("sw-context-token", config.contextToken || "", {
    expires: 365, // days
    path: "/",
    sameSite: "lax",
  });
});

const shopwareContext = createShopwareContext(app, {
  apiInstance,
});
app.use(shopwareContext);
app.mount("#app");
