<script setup lang="ts">
import { onMounted, ref } from "vue";
import { apiClient } from "./apiClient";
import HelloWorld from "./components/HelloWorld.vue";
import LoginForm from "./components/LoginForm.vue";
import AdminLoginForm from "./components/AdminLoginForm.vue";
import { adminApiClient } from "./adminApiClient";
import { ApiClientError } from "@shopware/api-client";
import type { RequestReturnType } from "#shopware";

const productsResponse = ref<RequestReturnType<"readProduct">>();

onMounted(async () => {
  await apiClient.invoke("readContext get /context", {});
  productsResponse.value = await apiClient.invoke("readProduct post /product", {
    limit: 2,
  });
  console.log(productsResponse.value);

  await getProducts();
});

async function getProducts() {
  try {
    const resp = await adminApiClient.invoke(
      "getProductList get /product?limit,page,query",
      {
        limit: 2,
      },
    );
  } catch (e) {
    if (e instanceof ApiClientError) {
      console.error("Problem with fetching ADMIN products", e);
    }
  }
}
</script>

<template>
  <div test-id="test-wrapper">
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
    <button @click="getProducts">Remove line item</button>
    <div>
      <div
        v-for="product in productsResponse?.elements"
        :key="product.id"
        style="margin-top: 20px"
      >
        <div>{{ product.translated?.name }}</div>
        <div>{{ product.calculatedPrice?.unitPrice }}</div>
      </div>
    </div>
    <h2>Client login test form:</h2>
    <LoginForm />
    <h2>Admin login test form:</h2>
    <AdminLoginForm />
  </div>
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
