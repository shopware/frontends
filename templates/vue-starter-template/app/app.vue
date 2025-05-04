<script setup lang="ts">
import type { Schemas } from "#shopware";
import { getPrefix } from "../i18n/src/helpers/prefix";

const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();
const contextResponse = await apiClient.invoke("readContext get /context");
sessionContextData.value = contextResponse.data;

useSessionContext(sessionContextData.value);

const { locale, availableLocales, defaultLocale, localeProperties, messages } =
  useI18n();
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
let languageToChangeId: string | null = null;

if (languages.value?.elements.length && router.currentRoute.value.name) {
  storeLanguages.value = languages.value?.elements;
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
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
