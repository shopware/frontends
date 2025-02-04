---
head:
  - - meta
    - name: og:title
      content: "Maintenance mode - Shopware Frontends"
  - - meta
    - name: og:description
      content: "Example of implementation maintenance mode page"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Integration:%20**Maintenance%20Mode**?fontSize=100px"
---

# Maintenance mode

You can activate the maintenance mode of your store by selecting your sales channel and then activating the maintenance mode under Status

## Detecting maintenance mode via API

Maintenance mode is returned as an error from all of the endpoints. We can detect it by using `onResponseError` hook.

```ts
import { isMaintenanceMode } from "@shopware/helpers";

const apiClient = createAPIClient({
  baseURL: shopwareEndpoint,
  accessToken: shopwareAccessToken,
  contextToken: Cookies.get("sw-context-token"),
});

apiClient.hook("onResponseError", (response) => {
  const error = isMaintenanceMode(response._data?.errors ?? []);
  // do proper reaction to maintenance mode
});
```

## Displaying maintenance page

:::warning
This example is for Nuxt 3 apps
:::

### Throwing MAINTENANCE_MODE error

Every error thrown within the application is automatically caught and the `error.vue` page is displayed.

```ts
import { isMaintenanceMode } from "@shopware/helpers";

apiClient.hook("onResponseError", (response) => {
  const error = isMaintenanceMode(response._data?.errors ?? []);
  if (error) {
    throw createError({
      statusCode: 503,
      statusMessage: "MAINTENANCE_MODE",
    });
  }
});
```

### Displaying maintenance mode page

```vue
// error.vue
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
    message: string;
  };
}>();

const isMaintenanceMode = computed(() => {
  return props.error.statusMessage === "MAINTENANCE_MODE";
});
</script>

<template>
  <div v-if="isMaintenanceMode">Maintenance Mode Page Content</div>
</template>
```

### IP Whitelisting

This document provides a step-by-step guide on how to add the possibility for whitelisting in the Frontends app.
Whitelisting allows specific users or IP addresses to bypass certain restrictions or maintenance modes, ensuring 
they have access to the application even when it is otherwise restricted.
 

The solution involves adding a server middleware that checks whether maintenance mode is enabled. If maintenance mode is active, SSR (Server-Side Rendering) mode will be off. This ensures that the backend IP is omitted, and CRS will take the role to display the maintenance page.

```ts
// frontends/templates/vue-demo-store/server/middleware/maintenance.ts
import { ApiClientError } from "@shopware/api-client";
import { isMaintenanceMode } from "@shopware/helpers";
import apiClient from "../apiBuilder";

export default defineEventHandler(async (event) => {
  try {
    await apiClient.invoke("readContext get /context");
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (isMaintenanceMode(error.details.errors ?? [])) {
        event.context.nuxt = event.context.nuxt ?? {};
        event.context.nuxt.noSSR = true;
        console.log("Maintenance mode is active");
      }
    }
  }
});
```
