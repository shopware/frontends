<script setup lang="ts">
import { onMounted, ref } from "vue";
import { apiClient, Schemas } from "./apiClient";
import HelloWorld from "./components/HelloWorld.vue";
import LoginForm from "./components/LoginForm.vue";

const products = ref<
  Schemas["EntitySearchResult"] & { elements?: Array<Schemas["Product"]> }
>();

onMounted(async () => {
  await apiClient.invoke("readContext get /context", {});
  products.value = await apiClient.invoke("readProduct post /product", {
    limit: 2,
  });
  console.log(products.value);
});
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <div>
    <div
      v-for="product in products?.elements"
      :key="product.id"
      style="margin-top: 20px"
    >
      <div>{{ product.translated?.name }}</div>
      <div>{{ product.calculatedPrice.unitPrice }}</div>
    </div>
  </div>
  <LoginForm />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
