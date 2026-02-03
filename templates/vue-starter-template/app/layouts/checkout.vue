<script setup lang="ts">
definePageMeta({
  layout: "checkout",
});

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

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

async function onLanguageChangeHandler(id: string) {
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
        @onLanguageChangeHandler="onLanguageChangeHandler"
      />

      <div class="border-b">
        <div
          class="flex items-center justify-between container mx-auto px-6 sm:px-0"
        >
          <div class="py-3.5 relative">
            <NuxtLink :to="formatLink('/')">
              <NuxtImg class="h-20 max-sm:h-10" src="/logo.svg" alt="logo" />
            </NuxtLink>
          </div>
          <div>
            <NuxtLink
              :to="formatLink('/')"
              class="py-3 px-4 bg-white rounded outline outline-2 outline-offset-[-2px] outline-brand-primary inline-flex items-center gap-1 text-brand-primary font-bold leading-6"
              >{{ $t("cart.continueShopping") }}</NuxtLink
            >
          </div>
        </div>
      </div>
    </header>
    <main class="mb-20" aria-label="Checkout">
      <slot />
    </main>
  </div>
</template>
