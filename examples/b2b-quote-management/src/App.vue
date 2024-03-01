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
  <div class="w-400 mx-auto">
    <h1 class="text-2xl mb-10 text-center">Shopware B2B Quote feature</h1>
    <div>
      <p class="mb-10">
        In this example we will show how to use the B2B Quote Management
        feature. B2b Quote Management is a feature that allows you to create
        quotes for your customers and manage them. This feature is available in
        Shopware Evolve plan.
      </p>
      <div v-if="!isLoggedIn">
        <p class="mb-2">Please login to use example:</p>
        <form class="flex flex-col gap-4" @submit.prevent="loginAction">
          <input class="border" type="text" v-model="username" />
          <input class="border" type="password" v-model="password" />
          <button type="submit">Login</button>
        </form>
      </div>
      <!-- 
      <QuotesTable v-if="isLoggedIn" class="mt-10" />
      <Quote v-if="isLoggedIn && chosenQuote" :quoteId="chosenQuote" /> -->

      <menu class="">
        <ul class="flex gap-10">
          <li class="text-xl">Request quote</li>
          <li class="text-xl">Quote list</li>
        </ul>
      </menu>
      <router-view></router-view>
    </div>
  </div>
</template>
