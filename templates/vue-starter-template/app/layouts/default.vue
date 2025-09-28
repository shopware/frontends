<script setup lang="ts">
import { getLanguageName } from "@shopware/helpers";

const { loadNavigationElements } = useNavigation();
const { data } = useAsyncData("mainNavigation", () => {
  return loadNavigationElements({ depth: 2 });
});

const { languages, changeLanguage, replaceToDevStorefront } =
  useInternationalization();
const { languageIdChain } = useSessionContext();
provide("swNavigation-main-navigation", data);

const currentLanguageLabel = computed(() => {
  const currentLanguage = languages.value?.find(
    (language) => language.id === languageIdChain.value,
  );
  return currentLanguage ? getLanguageName(currentLanguage) : "";
});

const languagesList = computed(
  () =>
    languages.value?.map((language) => {
      return {
        id: language.id,
        label: getLanguageName(language),
      };
    }) ?? [],
);

async function onChangeHandler(id: string) {
  const data = await changeLanguage(id);

  if (data.redirectUrl) {
    window.location.replace(replaceToDevStorefront(data.redirectUrl));
  } else {
    window.location.reload();
  }
}
</script>
<template>
  <div>
    <header>
      <LayoutMetaNavigation
        v-if="languagesList.length > 1"
        class="px-6"
        :current-language-label="currentLanguageLabel"
        :languages="languagesList"
        @onLanguageChangeHandler="onChangeHandler"
      />
      <LayoutHeader />
    </header>
    <main>
      <LayoutNotifications />
      <slot />
    </main>
  </div>
</template>
