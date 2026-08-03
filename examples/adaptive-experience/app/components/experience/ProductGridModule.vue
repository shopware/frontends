<script setup lang="ts">
// §8 product-grid props: identifiers and display options only. Product data
// comes from the shared listing composable, so Shopware stays the one owner of
// commerce data - the plan never carries products. Inline concrete shape: the
// Vue macro cannot resolve a zod `z.infer` alias at compile time.
defineProps<{
  listingKey?: string;
  categoryId?: string;
  productIds?: string[];
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
  limit?: number;
  filterPreset?: string;
}>();

const { getElements: products, loading } = useProductSearchListing();
const { plan } = useExperiencePlan();
const { track, isCompared, canCompareMore } = useExperienceEngine();

// The grid density is a §7 workspace concern (1-3), not a module prop. UnoCSS
// scans source text, so a `grid-cols-${n}` template would generate nothing;
// these static maps are exhaustive because the schema bounds columns to 1-3.
const COLUMN_CLASSES: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3",
};
const GRID_CLASSES =
  "grid auto-rows-fr gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-12 lg:gap-y-16";

const columnClass = computed(
  () => COLUMN_CLASSES[plan.value.workspace.columns],
);

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
    :class="[GRID_CLASSES, columnClass]"
    data-testid="loading"
  >
    <ProductCardSkeleton v-for="index in 6" :key="index" class="w-full" />
  </div>
  <div
    v-else
    :class="[GRID_CLASSES, columnClass]"
    data-testid="experience-product-grid"
  >
    <div
      v-for="product in products"
      :key="product.id"
      class="relative flex flex-col"
      @mouseenter="track({ type: 'product-viewed', productId: product.id })"
    >
      <SwProductCard
        :product="product"
        :is-product-listing="loading"
        class="w-full"
      />
      <!--
        The compare control floats over the product image's bottom-right, the
        mirror of the starter's wishlist button at the top-right. This overlay box
        reproduces the image's own sizing (aspect-square, min-h-[350px]) so the pill
        lands on the image corner without editing the shared card component; only
        the pill itself takes pointer events, so the image link stays clickable.
      -->
      <div
        class="pointer-events-none absolute inset-x-0 top-0 aspect-square min-h-[350px]"
      >
        <button
          type="button"
          class="pointer-events-auto absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          :class="
            isCompared(product.id)
              ? 'bg-brand-primary text-brand-on-primary ring-brand-primary hover:bg-brand-primary-hover'
              : 'bg-surface-surface/95 text-brand-primary ring-outline-outline-variant hover:bg-brand-secondary hover:text-brand-on-secondary hover:ring-brand-primary'
          "
          :disabled="!isCompared(product.id) && !canCompareMore"
          :data-testid="`experience-compare-${product.id}`"
          :aria-pressed="isCompared(product.id)"
          @click="toggleCompare(product.id)"
        >
          <span v-if="isCompared(product.id)" aria-hidden="true">✓</span>
          {{ isCompared(product.id) ? "Comparing" : "Compare" }}
        </button>
      </div>
    </div>
  </div>
</template>
