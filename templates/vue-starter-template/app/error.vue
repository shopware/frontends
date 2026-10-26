<script setup lang="ts">
import type { NuxtError } from "#app";

const { error } = defineProps<{
  error: NuxtError;
}>();

const { t, te, localeProperties } = useI18n();
const localePath = useLocalePath();

// Thrown by @shopware/nuxt-module when the Store API answers with
// FRAMEWORK__API_SALES_CHANNEL_MAINTENANCE_MODE.
const isMaintenanceMode = error.statusMessage === "MAINTENANCE_MODE";
const isNotFound = error.statusCode === 404;
const messageKey = `errorPage.${error.statusCode}`;
const message = te(messageKey) ? t(messageKey) : t("errors.message-default");

useSeoMeta({
  title: () =>
    isMaintenanceMode
      ? t("errorPage.maintenance.title")
      : `${error.statusCode} - ${message}`,
});

// Nuxt renders this instead of app.vue, so the lang set there is missing.
useHead({
  htmlAttrs: { lang: () => localeProperties.value.language },
});
</script>

<template>
  <main
    class="min-h-screen flex flex-col items-center px-6 py-10 md:py-16 bg-surface-background"
  >
    <NuxtLink :to="localePath('/')" class="mb-16 md:mb-24">
      <NuxtImg class="h-12 md:h-16" src="/logo.svg" alt="logo" />
    </NuxtLink>

    <ErrorsMaintenanceMode v-if="isMaintenanceMode" />
    <div
      v-else
      class="max-w-md flex flex-col items-center gap-4 text-center"
      data-testid="error-page"
    >
      <SharedIconBadge
        :icon="isNotFound ? 'i-carbon-search' : 'i-carbon-warning-alt'"
        :variant="isNotFound ? 'brand' : 'error'"
        size="large"
      />
      <h1 class="mt-2 flex flex-col items-center gap-4">
        <span
          class="block text-7xl md:text-8xl font-['Noto_Serif'] leading-none text-surface-on-surface"
        >
          {{ error.statusCode }}
        </span>
        <span class="block text-lg font-normal text-surface-on-surface-variant">
          {{ message }}
        </span>
      </h1>
      <NuxtLink
        :to="localePath('/')"
        class="mt-4 px-4 py-3 rounded bg-brand-primary text-brand-on-primary font-bold leading-normal inline-flex items-center justify-center hover:bg-brand-primary-hover transition-colors"
        data-testid="error-page-home-button"
      >
        {{ $t("errorPage.goBackHome") }}
      </NuxtLink>
    </div>
  </main>
</template>
