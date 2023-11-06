<script setup lang="ts">
import {
  useSessionContext,
  useUser,
} from "@shopware-pwa/composables-next/dist";

const { currency, selectedPaymentMethod, refreshSessionContext } =
  useSessionContext();
const { isLoggedIn } = useUser();

await refreshSessionContext();
</script>
<template>
  <div class="instructions">
    <div class="example">
      <p>
        Currency: <strong>{{ currency?.name }} ({{ currency?.symbol }})</strong>
      </p>
      <p>
        Default payment method:
        <strong>{{ selectedPaymentMethod?.name }}</strong>
      </p>
      <p>
        Is customer logged in: <strong>{{ isLoggedIn }}</strong>
      </p>
    </div>
  </div>
</template>
<style scoped>
.example {
  width: 500px;
  margin: 0 auto;
  text-align: left;
  padding: 10px 20px;
  border-radius: 10px;
}
</style>
