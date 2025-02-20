<script setup lang="ts">
import type { Schemas } from "#shopware";

const { currency, selectedPaymentMethod } = useSessionContext();
const { getLanguageIdFromCode, getAvailableLanguages } =
  useInternationalization();

const { isLoggedIn } = useUser();
const { t, availableLocales, locale: currentLocale } = useI18n();
const { resolvePath } = useNavigationSearch();
const { apiClient } = useShopwareContext();
const backendRoute = ref<Schemas["SeoUrl"] | null>();

// function to fetch the pretty URL for a different language
const findRouteForLanguage = async (languageCode: string) => {
  if (!backendRoute.value?.foreignKey) {
    return;
  }
  const languageId = await getLanguageIdFromCode(languageCode);
  const seoResult = await apiClient.invoke("readSeoUrl post /seo-url", {
    headers: {
      "sw-language-id": languageId,
    },
    body: {
      filter: [
        {
          type: "equals",
          field: "foreignKey",
          value: backendRoute.value?.foreignKey,
        },
      ],
    },
  });
  return seoResult.data.elements?.[0];
};

watch(currentLocale, async () => {
  // fetch the new pretty URL for a different language
  backendRoute.value = await findRouteForLanguage(unref(currentLocale));
});

onMounted(async () => {
  // fetch the available languages
  await getAvailableLanguages();
  const response = await resolvePath("/Summer-trends/");
  backendRoute.value = response;
});
</script>

<template>
  <div>
    <img class="logo" src="/shopware-frontends-logo.png" />
  </div>
  <div class="example">
    <div class="center">
      <h3>{{ t("general.choose_translation") }}:</h3>
      <a
        class="lang-option"
        href="#"
        :class="{ selected: currentLocale === locale }"
        v-for="locale in availableLocales.filter(
          (availableLocale) => !!['en-GB', 'de-DE'].includes(availableLocale),
        )"
        :key="locale"
        @click.prevent.stop="$i18n.setLocale(locale)"
      >
        {{ locale }}
      </a>
    </div>
    <p>
     {{ t("general.url") }}:
      <strong>{{ backendRoute?.seoPathInfo }}</strong>
    </p>
    <p>
      {{ t("general.currency") }}:
      <strong>{{ currency?.name }} ({{ currency?.symbol }})</strong>
    </p>
    <p>
      {{ t("general.default_payment_method") }}:
      <strong>{{ selectedPaymentMethod?.name }}</strong>
    </p>
    <p>
      {{ t("account.is_customer_logged_in") }}:
      <strong>{{ isLoggedIn }}</strong>
    </p>
  </div>
  <div>
    you can also examine what is returned from an API middleware and loaded by
    i18n module by visiting
    <strong><a :href="`${useRequestURL()}api/translations?locale=${currentLocale}`" target="_blank">{{ useRequestURL()}}api/translations?locale={{currentLocale}}</a></strong> 
  </div>
</template>
<style scoped>
.logo {
  max-width: 100%;
}

.center {
  text-align: center;
}
.example {
  width: 500px;
  margin: 0 auto;
  text-align: left;
  padding: 10px 20px;
  border-radius: 10px;
}
.lang-option {
  padding: 5px 10px;
  color: darkturquoise;
}

.selected {
  text-decoration: underline dotted dodgerblue;
  text-underline-offset: 4px;
}
</style>
