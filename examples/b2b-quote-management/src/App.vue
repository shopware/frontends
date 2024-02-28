<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  useSessionContext,
  useShopwareContext,
  useUser,
} from "@shopware-pwa/composables-next";
import QuotesTable from "./components/QuotesTable.vue";
import Quote from "./components/Quote.vue";

const { refreshSessionContext } = useSessionContext();
const { login } = useUser();

const username = ref("");
const password = ref("");
const chosenQuote = ref(null);

const isLoggedIn = ref(false);

refreshSessionContext();

const loginAction = async () => {
  await login({
    username: username.value,
    password: password.value,
  });
  isLoggedIn.value = true;
};
</script>
<template>
  <div>
    <!-- <h1 class="text-xl">Shopware B2B Quote Management</h1>

    <form v-if="!isLoggedIn" @submit.prevent="loginAction">
      <input class="border" type="text" v-model="username" />
      <input class="border" type="password" v-model="password" />
      <button type="submit">Login</button>
    </form>
    <QuotesTable v-if="isLoggedIn" class="mt-10" />
    <Quote v-if="isLoggedIn && chosenQuote" :quoteId="chosenQuote" /> -->
    <router-view></router-view>
  </div>
</template>
