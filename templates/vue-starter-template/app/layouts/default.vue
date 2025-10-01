<script setup lang="ts">
import { getLanguageName } from "@shopware/helpers";

const { languages, changeLanguage, replaceToDevStorefront } =
  useInternationalization();
const { languageIdChain } = useSessionContext();

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

const { loadNavigationElements: loadFooterNavigationElements } = useNavigation({
  type: "footer-navigation",
});
const { data: footerData } = useAsyncData("mainFooterNavigation", () => {
  return loadFooterNavigationElements({ depth: 1 });
});
provide("swNavigation-footer-navigation", footerData);
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
      <LayoutHeader class="px-6" />
    </header>
    <main>
      <LayoutNotifications />
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
