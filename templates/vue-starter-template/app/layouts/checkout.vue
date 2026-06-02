<script setup lang="ts">
definePageMeta({
  layout: "checkout",
});

import { getLanguageName } from "@shopware/helpers";

const { languages, changeLanguage, replaceToDevStorefront } =
  useInternationalization();
const { languageIdChain } = useSessionContext();
const {
  currenciesList,
  currentCurrencyId,
  changingCurrencyId,
  changeCurrency,
} = useCurrencySwitcher();

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

async function onCurrencyChangeHandler(id: string) {
  await changeCurrency(id);
}
</script>
<template>
  <div>
    <header>
      <LayoutMetaNavigation
        v-if="languagesList.length > 1 || currenciesList.length > 0"
        class="px-6"
        :current-language-id="languageIdChain"
        :languages="languagesList"
        :current-currency-id="currentCurrencyId"
        :currencies="currenciesList"
        :changing-currency-id="changingCurrencyId"
        @onLanguageChangeHandler="onLanguageChangeHandler"
        @onCurrencyChangeHandler="onCurrencyChangeHandler"
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
    <main class="mb-20" :aria-label="$t('layout.ariaLabels.checkout')">
      <slot />
    </main>
  </div>
</template>
