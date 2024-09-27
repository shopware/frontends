<script setup lang="ts">
import type { Schemas } from "#shopware";

const { search } = useProductSearch();

const product = ref<Schemas["Product"]>();
onMounted(async () => {
  const productResponse = await search("b2e974a54f8a48949a6397c72d2bffb5", {
    criteria: {
      associations: {
        properties: {},
        options: {
          associations: {
            group: {},
          },
        },
        manufacturer: {},
      },
    },
  });
  product.value = productResponse.product;
});
</script>
<template>
  <div test-id="test-wrapper">
    <Transition mode="out-in">
      <ProductView v-if="product" :product="product" />
    </Transition>
  </div>
</template>
