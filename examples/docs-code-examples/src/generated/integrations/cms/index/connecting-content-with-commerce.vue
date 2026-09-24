<!-- app/components/external-cms/CmsFeaturedProducts.vue -->
<script setup lang="ts">
import { useAsyncData, useProductSearch } from "#imports";
import type { Schemas } from "#shopware";

const props = defineProps<{
  heading?: string;
  productIds: string[];
}>();

const { search } = useProductSearch();

const { data: products } = await useAsyncData(
  `external-cms-products-${props.productIds.join("-")}`,
  async () => {
    const resolved = await Promise.all(
      props.productIds.map((id) =>
        search(id)
          .then((response) => response.product)
          .catch(() => null),
      ),
    );

    return resolved.filter(
      (product): product is Schemas["Product"] => !!product,
    );
  },
);
</script>

<template>
  <section>
    <h2 v-if="heading">{{ heading }}</h2>
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </section>
</template>
