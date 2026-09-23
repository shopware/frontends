// main.ts
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import previously implemented module
import ShopwareFrontends from "./plugins/vue-shopware-frontends";
const app = createApp(App);

app.use(ShopwareFrontends, {
    // pass options described under ShopwareFrontendsOptions type in the previous section
    endpoint: "https://demo-frontends.swstage.store",
    accessToken: "SWSCBHFSNTVMAWNZDNFKSHLAYW",
    apiDefaults: {},
});

app.mount("#app");
