<script setup lang="ts">
import { getCmsPage } from "@shopware-pwa/shopware-6-client";

const { apiInstance } = inject("shopware");
const cms = ref();

const { data: cmsResponse } = await useAsyncData("count", () =>
  getCmsPage("/", {}, apiInstance)
);
</script>

<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
