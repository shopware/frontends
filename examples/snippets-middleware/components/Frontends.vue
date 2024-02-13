<script setup lang="ts">
const { currency, selectedPaymentMethod } = useSessionContext();
const { isLoggedIn } = useUser();
const { t, availableLocales, locale: currentLocale } = useI18n();
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
    you can also examine what is returned by visiting
    <strong>/api/translations?locale={{ currentLocale }}</strong> and loaded by
    i18n module
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
