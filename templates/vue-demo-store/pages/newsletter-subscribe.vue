<script setup lang="ts">
import { newsletterConfirmation } from "@shopware-pwa/api-client";

const route = useRoute();
const { apiInstance } = useShopwareContext();
const error = ref(false);

try {
  await newsletterConfirmation(
    {
      em: route.query.em as string,
      hash: route.query.hash as string,
    },
    apiInstance,
  );
} catch (e) {
  error.value = true;
}
</script>
<template>
  <div class="max-w-screen-xl mx-auto px-6 sm:px-4">
    <h1 class="text-3xl mb-3">{{ $t("newsletter.subscriptionHeader") }}</h1>
    <div class="text-xl" :class="{ 'text-red': error, 'text-green': !error }">
      {{
        error
          ? $t("messages.error")
          : $t("newsletter.messages.newsletterSubscribed")
      }}
    </div>
  </div>
</template>
