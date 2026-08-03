<script setup lang="ts">
import { getLanguageName } from "@shopware/helpers";

import { createDefaultExperiencePlan } from "#shared/experience/defaults";

// Overrides the starter layout so the §7 shell can drive the header, navigation
// and footer, which live outside the page. The plan is one session-wide cell,
// so shell effects are scoped to the adaptive route; everywhere else renders the
// standard shell, which is also the §9 default. (A faithful §11 shell registry
// of async header/footer components is a later phase - here the existing layout
// components are driven by the shell values.)
const { plan: rawPlan } = useExperiencePlan();
const route = useRoute();

const shell = computed(() =>
  route.path.startsWith("/adaptive")
    ? rawPlan.value.shell
    : createDefaultExperiencePlan().shell,
);

// The §7 visual skin, scoped to the adaptive route like the shell. A single
// attribute high in the tree lets one stylesheet reskin the whole page - shell
// included - without touching the shared template components.
const vibe = computed(() =>
  route.path.startsWith("/adaptive") ? rawPlan.value.theme : "classic",
);

// The bold skin gets an expressive display face; the base look never loads it.
useHead(() => ({
  link:
    vibe.value === "genz"
      ? [
          { rel: "preconnect", href: "https://fonts.googleapis.com" },
          {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossorigin: "",
          },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap",
          },
        ]
      : [],
}));

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

  <div class="flex flex-col min-h-screen" :data-vibe="vibe">
    <header
      :class="
        shell.header === 'compact' ? 'sticky top-0 z-20 bg-white shadow-sm' : ''
      "
      :data-experience-header="shell.header"
    >
      <LayoutMetaNavigation
        v-if="
          shell.navigation !== 'hidden' &&
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
    <LayoutFooter v-if="shell.footer !== 'hidden'" />
  </div>
</template>
