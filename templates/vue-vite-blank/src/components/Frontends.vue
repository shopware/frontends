<script setup lang="ts">
import {
  useSessionContext,
  useCheckout,
  useUser,
} from "@shopware-pwa/composables-next";
defineProps<{
  template: string;
}>();
const { currency } = useSessionContext();
const { selectedPaymentMethod } = useCheckout();
const { isLoggedIn } = useUser();
</script>

<template>
  <div>
    <img class="logo" src="/shopware-frontends-logo.png" />
  </div>
  <h1>{{ template }}</h1>
  <div class="example">
    <p>
      Currency: <strong>{{ currency?.name }} ({{ currency?.symbol }})</strong>
    </p>
    <p>
      Default payment method: <strong>{{ selectedPaymentMethod?.name }}</strong>
    </p>
    <p>
      Is customer logged in: <strong>{{ isLoggedIn }}</strong>
    </p>
  </div>
</template>
<style scoped>
.logo {
  max-width: 100%;
}
.example {
  width: 500px;
  margin: 0 auto;
  text-align: left;
  padding: 10px 20px;
  border-radius: 10px;
}
</style>
