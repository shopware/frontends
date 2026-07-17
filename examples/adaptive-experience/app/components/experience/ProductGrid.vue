<script setup lang="ts">
defineProps<{
  columns: number;
}>();

// The plan carries only the column count. Product data comes from the shared
// listing composable, so Shopware stays the single source of commerce data.
const { getElements: products, loading } = useProductSearchListing();
const { track, isCompared, canCompareMore } = useExperienceSignals();

// UnoCSS generates classes statically, so a `grid-cols-${n}` template string
// would produce nothing. The registry bounds `columns` to 1-4, which makes this
// lookup exhaustive by contract.
const COLUMN_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4",
};

const GRID_CLASSES =
  "grid auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16";

function toggleCompare(productId: string) {
  track({
    type: isCompared(productId)
      ? "removed-from-comparison"
      : "added-to-comparison",
    productId,
  });
}
</script>

<template>
  <div
    v-if="loading"
    :class="[GRID_CLASSES, COLUMN_CLASSES[columns]]"
    data-testid="loading"
  >
    <ProductCardSkeleton v-for="index in 6" :key="index" class="w-full" />
  </div>
  <div
    v-else
    :class="[GRID_CLASSES, COLUMN_CLASSES[columns]]"
    data-testid="experience-product-grid"
  >
    <div v-for="product in products" :key="product.id" class="flex flex-col">
      <SwProductCard
        :product="product"
        :is-product-listing="loading"
        class="w-full"
      />
      <button
        type="button"
        class="mt-2 text-sm underline self-start disabled:opacity-50 disabled:no-underline"
        :disabled="!isCompared(product.id) && !canCompareMore"
        :data-testid="`experience-compare-${product.id}`"
        @click="toggleCompare(product.id)"
      >
        {{ isCompared(product.id) ? "Remove from compare" : "Compare" }}
      </button>
    </div>
  </div>
</template>
