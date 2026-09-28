import { createAPIClient } from "@shopware/api-client";
import type { operations } from "@shopware/api-client/store-api-types";
import { createShopwareContext } from "@shopware/composables";
import { createApp, ref } from "vue";

const app = createApp({});
const apiClient = createAPIClient<operations>({});
const shopwareContext = createShopwareContext(app, {});

app.provide("apiClient", apiClient);
app.provide("shopware", shopwareContext);
// thanks to this, `shopwareContext` can be injected in a component and other Vue-instance-aware places (like composables).
app.provide("swSessionContext", ref());
