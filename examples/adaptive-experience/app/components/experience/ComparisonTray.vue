<script setup lang="ts">
const props = defineProps<{
  productIds: string[];
}>();

// The tray reports semantic events and lets the rules decide what the plan
// becomes. It never patches the plan directly, which keeps the flow one-way:
// events -> signals -> rules -> plan -> render.
const { track } = useExperienceSignals();

// The plan stores ids only. Resolving them to products is this module's job and
// it reads from the shared listing, so product data never enters the plan.
const { getElements: products } = useProductSearchListing();

const selected = computed(() =>
  props.productIds
    .map((id) => products.value?.find((product) => product.id === id))
    .filter((product) => product !== undefined),
);
</script>

<template>
  <section
    class="border rounded p-4 mb-6"
    data-testid="experience-comparison-tray"
  >
    <header class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-medium">
        Comparing {{ selected.length }} products
      </h2>
      <button
        v-if="selected.length"
        type="button"
        class="text-sm underline"
        data-testid="experience-comparison-clear"
        @click="track({ type: 'comparison-cleared' })"
      >
        Clear
      </button>
    </header>

    <p v-if="!selected.length" class="text-sm">
      Add products to compare them side by side.
    </p>

    <ul v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <li
        v-for="product in selected"
        :key="product.id"
        class="border rounded p-3 flex flex-col gap-2"
      >
        <NuxtImg
          v-if="product.cover?.media?.url"
          :src="product.cover.media.url"
          :alt="product.translated?.name ?? ''"
          class="w-full h-24 object-contain"
          loading="lazy"
        />
        <span class="text-sm line-clamp-2">{{ product.translated?.name }}</span>
        <SharedPrice
          v-if="product.calculatedPrice"
          :value="product.calculatedPrice.unitPrice"
          class="text-sm font-medium"
        />
        <button
          type="button"
          class="text-xs underline mt-auto self-start"
          @click="
            track({ type: 'removed-from-comparison', productId: product.id })
          "
        >
          Remove
        </button>
      </li>
    </ul>
  </section>
</template>
