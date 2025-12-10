<script setup lang="ts">
import { useCmsTranslations } from "@shopware/composables";
import { defu } from "defu";

defineProps<{
  total: number;
  current: number;
}>();

type Translations = {
  listing: {
    previous: string;
    next: string;
  };
};

let translations: Translations = {
  listing: {
    previous: "Previous",
    next: "Next",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

defineEmits<(e: "changePage", page: number) => void>();
</script>
<template>
  <nav
    class="relative z-0 inline-flex rounded-md shadow-sm space-x-px"
    aria-label="Pagination"
  >
    <button
      v-if="current - 1 >= 2"
      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
      @click="$emit('changePage', current - 1)"
    >
      <span class="sr-only">{{ translations.listing.previous }}</span>
      <SwChevronIcon direction="left" :size="20" />
    </button>
    <button
      v-if="current > 2"
      class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      @click="$emit('changePage', 1)"
    >
      <span class="sr-only">Page </span>1
    </button>
    <span
      v-if="current - 1 > 2"
      class="relative inline-flex items-center px-4 py-2 border border-secondary-300 bg-white text-sm font-medium text-secondary-700"
    >
      ...
    </span>
    <button
      v-if="current > 1"
      class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      :class="[current == 2 ? 'rounded-l-md border border-secondary-300' : '']"
      @click="$emit('changePage', current - 1)"
    >
      <span class="sr-only">Page </span>{{ current - 1 }}
    </button>
    <button
      aria-current="page"
      class="bg-surface-surface-primary border-brand-primary text-brand-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      :class="[
        current - 1 >= 1 ? '' : 'rounded-l-md border border-secondary-300',
        total == current ? 'rounded-r-md border border-secondary-300' : '',
      ]"
    >
      <span class="sr-only">Page </span>{{ current }}
    </button>
    <button
      v-if="current < total"
      class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      :class="[
        total == current + 1 ? 'rounded-r-md border border-secondary-300' : '',
      ]"
      @click="$emit('changePage', current + 1)"
    >
      <span class="sr-only">Page </span>{{ current + 1 }}
    </button>
    <span
      v-if="total - current > 2"
      class="relative inline-flex items-center px-4 py-2 border border-secondary-300 bg-white text-sm font-medium text-secondary-700"
    >
      ...
    </span>
    <button
      v-if="total - current > 1"
      class="bg-white border-secondary-300 text-secondary-500 hover:bg-secondary-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
      @click="$emit('changePage', total)"
    >
      {{ total }}
    </button>
    <button
      v-if="total > current + 1"
      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50"
      @click="$emit('changePage', current + 1)"
    >
      <span class="sr-only">{{ translations.listing.next }}</span>
      <SwChevronIcon direction="right" :size="20" />
    </button>
  </nav>
</template>
