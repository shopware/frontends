<script setup lang="ts">
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const localePath = (path: string) => path;
const { formatLink } = useInternationalization(localePath);

const { productAssociations, isLoading, loadAssociations } =
  useProductAssociations(
    computed(() => product),
    { associationContext: "cross-selling", includeSeoUrls: true },
  );

const groups = computed(() =>
  productAssociations.value.filter((group) => group.products.length > 0),
);

watch(
  () => product.id,
  () => loadAssociations({ searchParams: {} }),
  { immediate: import.meta.client },
);
</script>

<template>
  <p role="status">{{ isLoading ? "Loading recommendations…" : "" }}</p>

  <section v-for="group in groups" :key="group.crossSelling.id">
    <h2>{{ getTranslatedProperty(group.crossSelling, "name") }}</h2>

    <ul>
      <li v-for="crossSellProduct in group.products" :key="crossSellProduct.id">
        <NuxtLink :to="formatLink(getProductRoute(crossSellProduct))">
          {{ getTranslatedProperty(crossSellProduct, "name") }}
        </NuxtLink>
      </li>
    </ul>

    <p v-if="group.total > group.products.length">
      Showing {{ group.products.length }} of {{ group.total }}
    </p>
  </section>
</template>
