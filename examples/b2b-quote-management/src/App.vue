<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {
  useSessionContext,
  useShopwareContext,
  useUser,
} from "@shopware-pwa/composables-next";

const { refreshSessionContext } = useSessionContext();
const chosenQuote = ref(null);
refreshSessionContext();
</script>
<template>
  <div class="test-wrapper container mx-auto">
    <ul class="my-10 text-2xl flex gap-10 justify-center">
      <li><router-link to="/quotes">Quotes</router-link></li>
      <li><router-link to="/request-quote">Request quote</router-link></li>
    </ul>
    <hr class="mb-10" />
    <router-view></router-view>
  </div>
</template>
