<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { ref, useTemplateRef } from "vue";

type SortOption = {
  key: string;
  label: string | null;
  translated?: {
    label: string;
  };
};

defineProps<{
  sortOptions: SortOption[];
  currentSort: string;
  label: string;
}>();

const emit = defineEmits<{
  "sort-change": [string];
}>();

const isSortMenuOpen = ref(false);
const dropdownElement = useTemplateRef<HTMLDivElement>("dropdownElement");

onClickOutside(dropdownElement, () => {
  isSortMenuOpen.value = false;
});

const handleSortingClick = (key: string) => {
  emit("sort-change", key);
  isSortMenuOpen.value = false;
};
</script>

<template>
  <div ref="dropdownElement" class="flex items-center">
    <div class="relative inline-block text-left">
      <SwBaseButton
        variant="ghost"
        size="medium"
        type="button"
        @click="isSortMenuOpen = !isSortMenuOpen"
        id="menu-button"
        :aria-expanded="isSortMenuOpen"
        aria-haspopup="true"
        class="group pr-0"
      >
        <span class="inline-flex items-center gap-1">
          {{ label }}
          <SwChevronIcon
            :direction="isSortMenuOpen ? 'up' : 'down'"
            :size="24"
            alt=""
          />
        </span>
      </SwBaseButton>
      <div
        :class="[isSortMenuOpen ? 'absolute' : 'hidden']"
        class="origin-top-right right-0 mt-2 w-40 rounded-md shadow-2xl bg-surface-surface ring-1 ring-outline-outline-variant focus:outline-none z-50"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="py-1" role="none">
          <button
            v-for="sorting in sortOptions"
            :key="sorting.key"
            @click="handleSortingClick(sorting.key)"
            :class="[
              sorting.key === currentSort
                ? 'font-medium text-surface-on-surface'
                : 'text-surface-on-surface-variant',
            ]"
            class="block w-full text-left px-4 py-2 text-sm bg-transparent hover:bg-surface-surface-container"
            role="menuitem"
            tabindex="-1"
          >
            {{ sorting.translated?.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
