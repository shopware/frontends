<script lang="ts" setup>
import type { Schemas } from "#shopware";

import CountrySearchSelectFlag from "./Flag.vue";

const props = withDefaults(
  defineProps<{
    country: Schemas["Country"];
    selected?: boolean;
  }>(),
  {
    selected: false,
  },
);

const emit = defineEmits<{
  highlight: [];
  select: [country: Schemas["Country"]];
}>();

const countryName = computed(
  () => props.country.translated?.name || props.country.name || "",
);
</script>

<template>
  <button
    type="button"
    role="option"
    class="group flex min-h-10 w-full items-center gap-3 rounded-md bg-transparent px-3 py-2 text-left text-sm text-surface-on-surface outline-none transition-colors hover:bg-surface-surface-container focus-visible:ring-2 focus-visible:ring-outline-outline-focus"
    :class="{ 'font-medium': selected }"
    :aria-selected="selected"
    @mouseenter="emit('highlight')"
    @click="emit('select', country)"
  >
    <CountrySearchSelectFlag :country="country" />

    <span class="min-w-0 flex-1 truncate">
      {{ countryName }}
    </span>

    <span
      v-if="selected"
      class="i-carbon-checkmark h-4 w-4 flex-none text-brand-primary"
      aria-hidden="true"
    />
  </button>
</template>
