<script setup lang="ts">
import { getLanguageName } from "@shopware/helpers";

import { createDefaultPlan } from "#shared/experience/defaults";

// Overrides the starter template's default layout. It is a copy of that layout
// with the shell driven by the plan: the adaptive shell has to own the layout,
// because the header and footer live outside the page.
const { plan: rawPlan } = useExperiencePlan();
const route = useRoute();

// STOPGAP. The plan has no route dimension, so a shell change made on the
// adaptive route followed the shopper everywhere: two price sorts hid the
// language and currency switchers across the whole storefront, and the only
// control that restores them lives on /adaptive. Scoping the shell to the route
// that adapts keeps that contained.
//
// The real fix is `routeKey` on the plan, per blueprint section 7. Remove this
// when the contract is rebuilt.
const plan = computed(() =>
  route.path.startsWith("/adaptive")
    ? rawPlan.value
    : { ...rawPlan.value, shell: createDefaultPlan().shell },
);

const { loadNavigationElements } = useNavigation();
const { data } = useAsyncData("mainNavigation", () => {
  return loadNavigationElements({ depth: 2 });
});

const { languages, changeLanguage, replaceToDevStorefront } =
  useInternationalization();
const { currentLanguageId } = useSessionContext();
const {
  currenciesList,
  currentCurrencyId,
  changingCurrencyId,
  changeCurrency,
} = useCurrencySwitcher();
provide("swNavigation-main-navigation", data);

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

async function onCurrencyChangeHandler(id: string) {
  await changeCurrency(id);
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
  <DevOnly>
    <ShopwareBanner />
  </DevOnly>

  <div class="flex flex-col min-h-screen">
    <header
      :class="
        plan.shell.header === 'compact'
          ? 'sticky top-0 z-20 bg-white shadow-sm'
          : ''
      "
      :data-experience-header="plan.shell.header"
    >
      <LayoutMetaNavigation
        v-if="
          plan.shell.navigation === 'standard' &&
          (languagesList.length > 1 || currenciesList.length > 0) &&
          currentLanguageId
        "
        class="px-6"
        :current-language-id="currentLanguageId"
        :languages="languagesList"
        :current-currency-id="currentCurrencyId"
        :currencies="currenciesList"
        :changing-currency-id="changingCurrencyId"
        @onLanguageChangeHandler="onChangeHandler"
        @onCurrencyChangeHandler="onCurrencyChangeHandler"
      />
      <LayoutHeader />
    </header>
    <main class="flex-1" :aria-label="$t('layout.ariaLabels.mainContent')">
      <LayoutNotifications />
      <slot />
    </main>
    <LayoutFooter v-if="plan.shell.footer === 'standard'" />
  </div>
</template>
