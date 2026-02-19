<script setup lang="ts">
import { getPrefix } from "#imports";
import type { Schemas } from "#shopware";

useHead({
  title: "Shopware Starter Demo store",
  meta: [{ name: "description", content: "Shopware Starter Demo store" }],
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "preconnect",
      href: "https://cdn.shopware.store",
    },
  ],
});

const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();

const { refreshCart } = useCart();
const { getWishlistProducts } = useWishlist();

useNotifications();

const {
  getAvailableLanguages,
  getLanguageCodeFromId,
  getLanguageIdFromCode,
  changeLanguage,
  languages: storeLanguages,
} = useInternationalization();

const [contextResponse, languagesResponse] = await Promise.all([
  apiClient.invoke("readContext get /context"),
  useAsyncData("languages", async () => {
    return await getAvailableLanguages();
  }),
]);
const languages = unref(languagesResponse.data);

sessionContextData.value = contextResponse.data;

useSessionContext(sessionContextData.value);

const { locale, availableLocales, defaultLocale, localeProperties, messages } =
  useI18n();
const router = useRouter();
const route = useRoute();

const { languageIdChain, refreshSessionContext } = useSessionContext();

let languageToChangeId: string | null = null;

if (languages && router.currentRoute.value.name) {
  storeLanguages.value = languages.elements;
  // Prefix from url
  const prefix = getPrefix(
    availableLocales,
    router.currentRoute.value.name as string,
    defaultLocale,
  );

  provide(
    "cmsTranslations",
    messages.value[(prefix as keyof typeof messages.value) || defaultLocale] ??
      {},
  );

  // Language set on the backend side
  if (localeProperties.value.localeId) {
    if (languageIdChain.value !== localeProperties.value.localeId) {
      languageToChangeId = localeProperties.value.localeId as string;
    }
  } else {
    const sessionLanguage = getLanguageCodeFromId(languageIdChain.value);

    // If languages are not the same, set one from prefix
    if (sessionLanguage !== prefix) {
      languageToChangeId = getLanguageIdFromCode(
        prefix ? prefix : defaultLocale,
      );
    }
  }

  if (languageToChangeId) {
    apiClient.defaultHeaders.apply({
      "sw-language-id": languageToChangeId,
    });
    await changeLanguage(languageToChangeId);
    await refreshSessionContext();
  }

  locale.value = (
    prefix ? prefix : defaultLocale
  ) as keyof typeof messages.value;
  // Set prefix from CMS components
  provide("urlPrefix", prefix);
}

onMounted(() => {
  refreshCart();
  const isWishlistPage = route.name?.toString().endsWith("wishlist") ?? false;
  if (!isWishlistPage) {
    getWishlistProducts();
  }
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
