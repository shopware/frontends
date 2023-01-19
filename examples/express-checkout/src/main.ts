import { createApp, ref } from "vue";
import { createShopwareContext } from "@shopware-pwa/composables-next";
import { createInstance } from "@shopware-pwa/api-client";
import Cookies from "js-cookie";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

const cookieContextToken = Cookies.get("sw-context-token");
const cookieLanguageId = Cookies.get("sw-language-id");

const contextToken = ref(cookieContextToken);
const languageId = ref(cookieLanguageId);
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:pathMatch(.*)",
      component: () => import("./App.vue"),
    },
  ],
});
const app = createApp(App);

const shopwareContext = createShopwareContext(app, {
  apiInstance: createInstance({
    endpoint: "https://demo-frontends.shopware.store",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    contextToken: contextToken.value,
    languageId: languageId.value,
  }),
});
app.use(router);
app.use(shopwareContext);
app.mount("#app");
