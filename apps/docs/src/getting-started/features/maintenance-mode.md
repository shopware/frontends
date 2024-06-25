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
import { isMaintenanceMode } from "@shopware-pwa/helpers-next";

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
import { isMaintenanceMode } from "@shopware-pwa/helpers-next";

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
