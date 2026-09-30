<script setup lang="ts">
defineProps<{
  template: string;
}>();

const { currency, selectedPaymentMethod } = useSessionContext();
const { isLoggedIn } = useUser();
</script>

<template>
  <div>
    <img class="logo" src="/shopware-frontends-logo.png" />
  </div>
  <h1>{{ template }}</h1>
  <div class="example">
    <p>
      Currency:
      <strong
        >{{ currency?.translated?.name }} ({{
          currency?.translated?.symbol
        }})</strong
      >
    </p>
    <p>
      Default payment method:
      <strong>{{ selectedPaymentMethod?.translated?.name }}</strong>
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
