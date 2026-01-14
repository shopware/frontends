<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

const route = useRoute();
const { apiClient } = useShopwareContext();
const error = ref(false);
const errorMessage = ref<string>("");
const loading = ref(true);

const { resolveApiErrors } = useApiErrorsResolver(
  "newsletter_subscribe_confirmation",
);

onMounted(async () => {
  try {
    await apiClient.invoke("confirmNewsletter post /newsletter/confirm", {
      body: {
        em: route.query.em as string,
        hash: route.query.hash as string,
      },
    });
  } catch (err) {
    error.value = true;
    if (err instanceof ApiClientError) {
      const errors = resolveApiErrors(err.details.errors);
      errorMessage.value = errors[0] || "";
    } else {
      errorMessage.value = "";
    }
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <div class="container mx-auto px-6 sm:px-4 py-10">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl md:text-4xl font-bold mb-6">
        {{ $t("newsletter.subscriptionHeader") }}
      </h1>
      <div
        v-if="loading"
        class="flex flex-row items-center gap-3 justify-center py-10"
      >
        <p class="text-base text-surface-on-surface">
          {{ $t("newsletter.messages.loading") }}
        </p>
        <div
          class="size-5 i-carbon-circle-dash animate-spin animate-count-infinite animate-duration-2000 text-brand-primary"
        />
      </div>
      <div
        v-else
        class="p-6 rounded-lg border-2"
        :class="{
          'bg-states-error-container border-states-error text-states-on-error-container':
            error,
          'bg-states-success-container border-states-success text-states-on-success-container':
            !error,
        }"
      >
        <p class="text-lg font-medium">
          {{
            error
              ? errorMessage || $t("errors.message-default")
              : $t("newsletter.messages.newsletterSubscribed")
          }}
        </p>
        <p
          v-if="!error"
          class="mt-4 text-base text-states-on-success-container opacity-80"
        >
          {{ $t("newsletter.subscriptionInfo") }}
        </p>
      </div>
    </div>
  </div>
</template>
