<script setup lang="ts">
import type { Schemas } from "#shopware";

function getPrefix(
  locales: string[],
  name: string,
  fallbackLocale: string,
): string {
  if (name.includes(fallbackLocale)) return "";
  const index = locales.findIndex((element) => name.includes(element));
  return index >= 0 ? locales[index] : "";
}

const { apiClient } = useShopwareContext();
const sessionContextData = ref<Schemas["SalesChannelContext"]>();
const contextResponse = await apiClient.invoke("readContext get /context");
sessionContextData.value = contextResponse.data;

useSessionContext(sessionContextData.value);

const { languageIdChain, refreshSessionContext } = useSessionContext();
const { locale, availableLocales, defaultLocale, localeProperties } = useI18n();
const router = useRouter();
const {
  getAvailableLanguages,
  getLanguageCodeFromId,
  getLanguageIdFromCode,
  changeLanguage,
  languages: storeLanguages,
} = useInternationalization();

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

  // Language set on the backend side
  if (localeProperties.value.localeId) {
    if (languageIdChain.value !== localeProperties.value.localeId) {
      languageToChangeId = localeProperties.value.localeId;
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
    await changeLanguage(languageToChangeId);
    await refreshSessionContext();
  }

  locale.value = prefix ? prefix : defaultLocale;
}
</script>

<template>
  <div id="app" test-id="test-wrapper">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
