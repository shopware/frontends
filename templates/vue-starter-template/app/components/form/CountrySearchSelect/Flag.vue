<script lang="ts" setup>
import type { Schemas } from "#shopware";

const props = defineProps<{
  country: Schemas["Country"] | null;
}>();

const hasLoadError = shallowRef(false);

const countryIso = computed(() => {
  const iso = (
    props.country?.translated?.iso ||
    props.country?.iso ||
    ""
  ).toUpperCase();
  return /^[A-Z]{2}$/.test(iso) ? iso : "";
});

const flagUrl = computed(() => {
  if (!countryIso.value || hasLoadError.value) return "";

  return `https://flagcdn.com/${countryIso.value.toLowerCase()}.svg`;
});

watch(
  () => props.country?.id,
  () => {
    hasLoadError.value = false;
  },
);
</script>

<template>
  <span
    v-if="countryIso"
    class="inline-flex h-4 w-6 flex-none items-center justify-center overflow-hidden rounded-sm ring-1 ring-outline-outline-variant"
    aria-hidden="true"
  >
    <img
      v-if="flagUrl"
      :src="flagUrl"
      width="24"
      height="18"
      alt=""
      class="h-full w-full object-cover"
      @error="hasLoadError = true"
    />
    <span
      v-else-if="countryIso"
      class="w-full text-center text-[10px] leading-4 text-surface-on-surface-variant"
      translate="no"
    >
      {{ countryIso }}
    </span>
  </span>
</template>
