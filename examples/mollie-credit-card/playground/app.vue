<script setup lang="ts">
import Frontends from "./components/Frontends.vue";
const { refreshSessionContext } = useSessionContext();
const CreditCardError = ref();
const CreditCardToken = ref();
onMounted(() => {
  refreshSessionContext();
});
</script>

<template>
  <div id="app" test-id="test-wrapper">
    <Frontends template="Blank Vue 3 template (Nuxt)" />
    <div class="mollie-credit-card-wrapper">
      <ShopwareFrontendsCreditCard
        submit-button-label="Save"
        locale="en_US"
        :submit-disabled="!!CreditCardToken"
        @submit="
          (token) => {
            CreditCardToken = `${token} ✔️`;
            CreditCardError = null;
          }
        "
        @error="
          (message) => {
            CreditCardError = `${message} ❌`;
          }
        "
      />
      <div class="demo-mollie-results">
        <div>
          Test Credit Number:
          <pre>2223 0000 1047 9399</pre>
        </div>
        <hr />
        <div v-if="CreditCardError">Error: {{ CreditCardError }}</div>
        <div v-if="CreditCardToken">Token: {{ CreditCardToken }}</div>
      </div>
    </div>
  </div>
</template>
<style>
@import "./style.css";

.mollie-credit-card-wrapper {
  text-align: left;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
}
</style>
