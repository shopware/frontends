<script setup lang="ts">
const route = useRoute();
const { apiClient } = useShopwareContext();
const error = ref(false);

try {
  await apiClient.invoke("confirmNewsletter post /newsletter/confirm", {
    em: route.query.em as string,
    hash: route.query.hash as string,
  });
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
