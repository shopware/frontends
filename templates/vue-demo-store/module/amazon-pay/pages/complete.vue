<script setup lang="ts">
import { useRoute } from "#app";
const route = useRoute();

const { complete } = useAmazonPayCheckout();
const result = ref();
const completeAction = async () => {
  result.value = await (await complete()).json();
};


</script>

<template>
<div class="flex flex-col items-center justify-center">
  <pre>{{ result }}</pre>
  <button @click="completeAction" class="p-2 mt-8">Complete</button>
</div>
</template>
