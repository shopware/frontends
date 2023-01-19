import { createApp, ref } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import { createInstance } from "@shopware-pwa/api-client";
import Cookies from "js-cookie";

import App from "./App.vue";

const cookieContextToken = Cookies.get("sw-context-token");
const cookieLanguageId = Cookies.get("sw-language-id");

const contextToken = ref(cookieContextToken || " ");
const languageId = ref(cookieLanguageId);

const app = createApp(App);

const shopwareContext = createShopwareContext(app, {
  apiInstance: createInstance({
    endpoint: "https://demo-frontends.shopware.store",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    contextToken: contextToken.value,
    languageId: languageId.value,
  }),
});
app.use(shopwareContext);
app.mount("#app");
