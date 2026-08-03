<script setup lang="ts">
// §8 product-comparison props carry ids only. This module reports semantic
// events and lets the rules decide the plan; it never patches the plan
// directly, keeping the flow one-way: events -> rules -> plan -> render.
// Inline concrete shape: the Vue macro cannot resolve a zod `z.infer` alias.
const props = defineProps<{
  productIds: string[];
  attributeGroups?: string[];
}>();

const { track } = useExperienceEngine();
const { getElements: products } = useProductSearchListing();

const selected = computed(() =>
  props.productIds
    .map((id) => products.value?.find((product) => product.id === id))
    .filter((product) => product !== undefined),
);
</script>

<template>
  <section
    class="border border-outline-outline-variant rounded-lg bg-surface-surface-container-low p-4 sm:p-5 mb-6"
    data-testid="experience-comparison-tray"
  >
    <header class="flex items-center justify-between gap-4 mb-4">
      <h2
        class="text-base sm:text-lg font-semibold text-surface-on-surface m-0"
      >
        Comparing {{ selected.length }}
        {{ selected.length === 1 ? "product" : "products" }}
      </h2>
      <button
        v-if="selected.length"
        type="button"
        class="text-sm font-medium text-brand-primary hover:text-brand-primary-hover underline underline-offset-2"
        data-testid="experience-comparison-clear"
        @click="track({ type: 'comparison-cleared' })"
      >
        Clear all
      </button>
    </header>

    <p
      v-if="!selected.length"
      class="text-sm text-surface-on-surface-variant m-0"
    >
      Add products to compare them side by side.
    </p>

    <ul
      v-else
      class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 m-0 p-0 list-none"
    >
      <li
        v-for="product in selected"
        :key="product.id"
        class="relative border border-outline-outline-variant rounded-lg bg-surface-surface p-3 flex flex-col gap-2"
      >
        <button
          type="button"
          class="absolute top-1.5 right-1.5 w-6 h-6 inline-flex items-center justify-center rounded-full bg-surface-surface-container-high text-surface-on-surface-variant hover:bg-brand-secondary hover:text-brand-on-secondary text-xs leading-none transition-colors"
          :aria-label="`Remove ${product.translated?.name ?? 'product'} from comparison`"
          @click="
            track({ type: 'removed-from-comparison', productId: product.id })
          "
        >
          ✕
        </button>
        <NuxtImg
          v-if="product.cover?.media?.url"
          :src="product.cover.media.url"
          :alt="product.translated?.name ?? ''"
          class="w-full h-24 object-contain"
          loading="lazy"
        />
        <span class="text-sm line-clamp-2 text-surface-on-surface">{{
          product.translated?.name
        }}</span>
        <SharedPrice
          v-if="product.calculatedPrice"
          :value="product.calculatedPrice.unitPrice"
          class="text-sm font-semibold text-brand-primary mt-auto"
        />
      </li>
    </ul>
  </section>
</template>
