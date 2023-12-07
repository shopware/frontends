<script setup lang="ts">
import { getPrefix } from "./i18n/src/helpers/prefix";
import type { Schemas } from "#shopware";

/**
 * Init breadcrumbs context
 */
useBreadcrumbs();

useHead({
  title: "Shopware Demo store",
  meta: [{ name: "description", content: "Shopware Demo store" }],
  htmlAttrs: {
    lang: "en",
  },
});

const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();
sessionContextData.value = await apiClient.invoke("readContext get /context");

// If you enable runtimeConfig.shopware.useUserContextInSSR, then you can use this code to share session between server and client.
// const { data: sessionContextData } = await useAsyncData(
//   "sessionContext",
//   async () => {
//     return await getSessionContext(apiInstance);
//   }
// );

// read the locale/lang code from accept-language header (i.e. en, en-GB or de-DE)
// and set configuration for price formatting globally
const headers = useRequestHeaders();
// Extract the first (with highest priority order) locale or lang code from accept-language header
// for example: "en-US;q=0.7,en;q=0.3" will return "en-US"
const localeFromHeader = headers?.["accept-language"]
  ?.split(",")
  ?.map(
    (languageConfig) => languageConfig.match(/^([a-z]{2}(?:-[A-Z]{2})?)/)?.[0],
  )
  .find(Boolean);

usePrice({
  currencyCode: sessionContextData.value?.currency?.isoCode || "",
  localeCode: localeFromHeader,
});

useSessionContext(sessionContextData.value);

const { getWishlistProducts } = useWishlist();
const { refreshCart } = useCart();

useNotifications();
useAddress();

const { locale, availableLocales, defaultLocale } = useI18n();
const router = useRouter();
const {
  getAvailableLanguages,
  getLanguageCodeFromId,
  getLanguageIdFromCode,
  changeLanguage,
  languages: storeLanguages,
} = useInternationalization();
const { languageIdChain, refreshSessionContext } = useSessionContext();

const { data: languages } = await useAsyncData("languages", async () => {
  return await getAvailableLanguages();
});

if (languages.value?.elements.length && router.currentRoute.value.name) {
  storeLanguages.value = languages.value?.elements;
  // Prefix from url
  const prefix = getPrefix(
    availableLocales,
    router.currentRoute.value.name as string,
    defaultLocale,
  );

  // Language set on the backend side
  const sessionLanguage = getLanguageCodeFromId(languageIdChain.value);
  // If languages are not the same, set one from prefix
  if (sessionLanguage !== prefix) {
    await changeLanguage(
      getLanguageIdFromCode(prefix ? prefix : defaultLocale),
    );
    await refreshSessionContext();
  }

  locale.value = prefix ? prefix : defaultLocale;
  // Set prefix from CMS components
  provide("urlPrefix", prefix);
}

onMounted(() => {
  refreshCart();
  getWishlistProducts();
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
h2 {
  @apply text-4xl py-4;
}

select {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIGZpbGw9J25vbmUnIHZpZXdCb3g9JzAgMCAyMCAyMCc+PHBhdGggc3Ryb2tlPScjNmI3MjgwJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnIHN0cm9rZS13aWR0aD0nMS41JyBkPSdNNiA4bDQgNCA0LTQnLz48L3N2Zz4=");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  appearance: none;
}
</style>
