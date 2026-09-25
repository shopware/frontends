<script setup lang="ts">
import { getLanguageName } from "@shopware/helpers";

const { apiClient } = useShopwareContext();
const {
  languages: storeLanguages,
  getAvailableLanguages,
  changeLanguage,
  replaceToDevStorefront,
} = useInternationalization();
const {
  sessionContext,
  refreshSessionContext,
  currentLanguageId,
  currency: currentCurrency,
  setCurrency,
} = useSessionContext();

const languagesQuery = useAsyncData("switcher-languages", () =>
  getAvailableLanguages(),
);
const currenciesQuery = useAsyncData("switcher-currencies", async () => {
  const { data } = await apiClient.invoke("readCurrency post /currency");
  return data;
});

await Promise.all([languagesQuery, currenciesQuery]);

// nothing fills the session context on its own - the Nuxt module only
// provides an empty ref, and both selects read their current value from it
if (!sessionContext.value) {
  await refreshSessionContext();
}

if (languagesQuery.data.value) {
  storeLanguages.value = languagesQuery.data.value.elements;
}

const currencies = currenciesQuery.data;

const loadError = computed(() => {
  if (languagesQuery.error.value && currenciesQuery.error.value)
    return "The language and currency options could not be loaded.";
  if (languagesQuery.error.value)
    return "The language options could not be loaded.";
  if (currenciesQuery.error.value)
    return "The currency options could not be loaded.";
  return "";
});

const isSwitchingContext = ref(false);
const contextSwitchError = ref("");

const switchLanguage = async (languageId: string) => {
  if (isSwitchingContext.value) return;
  if (!languageId || languageId === currentLanguageId.value) return;

  contextSwitchError.value = "";
  isSwitchingContext.value = true;

  let redirectUrl: string | undefined;

  try {
    ({ redirectUrl } = await changeLanguage(languageId));
  } catch (error) {
    console.error(error);
    contextSwitchError.value = "The language could not be changed.";
    isSwitchingContext.value = false;
    return;
  }

  try {
    if (redirectUrl) {
      window.location.replace(replaceToDevStorefront(redirectUrl));
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
    contextSwitchError.value =
      "The language was changed, but this page could not redirect. Reload to continue.";
    isSwitchingContext.value = false;
  }
};

const switchCurrency = async (currencyId: string) => {
  if (isSwitchingContext.value) return;
  if (!currencyId || currencyId === currentCurrency.value?.id) return;

  contextSwitchError.value = "";
  isSwitchingContext.value = true;

  try {
    await setCurrency({ id: currencyId });

    if (currentCurrency.value?.id !== currencyId) {
      contextSwitchError.value = "The currency could not be changed.";
    }
  } catch (error) {
    console.error(error);
    // setCurrency patches and then refreshes; a throw can come from either
    // half, so this is unconfirmed rather than failed
    contextSwitchError.value =
      "The currency may have changed, but this page could not confirm it. Reload to see the current prices.";
  } finally {
    isSwitchingContext.value = false;
  }
};
</script>

<template>
  <p v-if="loadError" role="alert">{{ loadError }}</p>
  <p v-if="contextSwitchError" role="alert">{{ contextSwitchError }}</p>

  <label>
    Language
    <select
      :value="currentLanguageId"
      :aria-disabled="isSwitchingContext"
      :aria-busy="isSwitchingContext"
      @change="switchLanguage(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="language in storeLanguages ?? []"
        :key="language.id"
        :value="language.id"
      >
        {{ getLanguageName(language) }}
      </option>
    </select>
  </label>

  <label>
    Currency
    <select
      :value="currentCurrency?.id"
      :aria-disabled="isSwitchingContext"
      :aria-busy="isSwitchingContext"
      @change="switchCurrency(($event.target as HTMLSelectElement).value)"
    >
      <option
        v-for="currency in currencies ?? []"
        :key="currency.id"
        :value="currency.id"
      >
        {{ currency.translated?.name ?? currency.name }} ({{
          currency.isoCode
        }})
      </option>
    </select>
  </label>

  <p aria-live="polite">
    Prices are shown in
    {{ currentCurrency?.isoCode ?? "the default currency" }}.
  </p>
</template>
