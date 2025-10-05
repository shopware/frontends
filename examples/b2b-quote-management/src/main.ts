import Aura from "@primevue/themes/aura";
import { createShopwareContext } from "@shopware/composables";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import { apiClient } from "./apiClient";
import Quote from "./components/Quote.vue";
import QuotesTable from "./components/QuotesTable.vue";
import RequestQuote from "./components/RequestQuote.vue";
import "virtual:uno.css";
import "./assets/main.css";

const routes = [
  { path: "/", component: App, name: "home" },
  { path: "/quotes", component: QuotesTable, name: "quotesTable" },
  { path: "/quote/:id", component: Quote, name: "quote" },
  { path: "/request-quote", component: RequestQuote, name: "requestQuote" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

const shopwareContext = createShopwareContext(app, {});
app.provide("apiClient", apiClient);
app.use(shopwareContext);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.mount("#app");
