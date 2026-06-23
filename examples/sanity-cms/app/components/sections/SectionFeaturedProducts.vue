<script setup lang="ts">
import type { Schemas } from "#shopware";

// Featured products block: Sanity stores only the Shopware product IDs. We
// resolve live commerce data (price, media, availability) from the Store API
// during SSR via useAsyncData, so the cards render in the initial HTML.
const props = defineProps<{
  section: { _key?: string; heading?: string; productIds?: string[] };
}>();

const { search } = useProductSearch();

const { data: products, pending } = await useAsyncData(
  `featured-products-${props.section._key ?? "default"}`,
  async () => {
    const ids = props.section.productIds ?? [];
    const resolved = await Promise.all(
      ids.map((id) =>
        search(id)
          .then((response) => response.product)
          .catch(() => null),
      ),
    );
    return resolved.filter((p): p is Schemas["Product"] => !!p);
  },
);
</script>

<template>
  <section class="mx-auto max-w-6xl scroll-mt-8 px-6 py-20">
    <div class="mb-12 text-center">
      <span
        class="text-sm font-semibold uppercase tracking-widest text-fuchsia-600"
      >
        Shop
      </span>
      <h2
        v-if="section.heading"
        class="mt-2 font-display text-4xl font-bold tracking-tight"
      >
        {{ section.heading }}
      </h2>
    </div>

    <div v-if="pending" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="n in section.productIds?.length || 3"
        :key="n"
        class="h-80 animate-pulse rounded-3xl bg-slate-200/70"
      />
    </div>
    <div
      v-else-if="products?.length"
      class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
    <p v-else class="text-center text-slate-400">
      No products resolved - check the IDs in Sanity.
    </p>
  </section>
</template>
