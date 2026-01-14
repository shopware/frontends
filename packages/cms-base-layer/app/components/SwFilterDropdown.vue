<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref, useTemplateRef } from "vue";

defineProps<{
  label: string;
  isActive?: boolean;
}>();

const isOpen = ref(false);
const dropdownElement = useTemplateRef<HTMLDivElement>("dropdownElement");

onClickOutside(dropdownElement, () => {
  isOpen.value = false;
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div ref="dropdownElement" class="relative">
    <!-- Pill button -->
    <button
      type="button"
      class="bg-brand-tertiary rounded-full px-4 py-1.5 inline-flex items-center gap-1 hover:bg-brand-tertiary-hover transition-colors"
      :class="{ 'ring-2 ring-brand-primary': isActive }"
      @click="toggle"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span class="text-brand-on-tertiary text-base font-normal leading-normal">
        {{ label }}
      </span>
      <SwChevronIcon
        :direction="isOpen ? 'up' : 'down'"
        :size="24"
        class="text-brand-on-tertiary"
      />
    </button>

    <!-- Dropdown panel -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 mt-2 min-w-64 bg-surface-surface rounded-lg shadow-lg ring-1 ring-outline-outline-variant z-50 p-4"
      role="menu"
    >
      <slot />
    </div>
  </div>
</template>
