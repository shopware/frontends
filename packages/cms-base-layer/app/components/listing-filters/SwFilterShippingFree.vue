<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      id: string;
      code: keyof Schemas['ProductListingResult']['currentFilters'];
      label: string;
      name: string;
    }
  "
>
import { onClickOutside } from "@vueuse/core";
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
  description?: string; // Optional description for i18n
}>();

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();
const currentFilterData = computed(
  () => !!props.selectedFilters[props.filter?.code],
);

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => {
  isFilterVisible.value = false;
});

const handleRadioUpdate = (val: string | null | boolean | undefined) => {
  emits("select-value", { code: props.filter.code, value: !!val });
};
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-4">
    <div class="self-stretch flex flex-col justify-center items-center">
      <div 
        class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-between items-center gap-1 cursor-pointer"
        @click="toggle"
        role="button"
        tabindex="0"
        :aria-expanded="isFilterVisible"
        :aria-controls="`filter-${props.filter.code}`"
        @keydown.enter="toggle"
        @keydown.space.prevent="toggle"
      >
        <div class="flex-1 flex items-center gap-2.5">
          <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal text-left">
            {{ props.filter.label }}
          </div>
        </div>
        <SwIconButton 
          type="ghost" 
          :aria-label="isFilterVisible ? 'Collapse filter' : 'Expand filter'"
          tabindex="-1"
        >
          <SwChevronIcon :direction="isFilterVisible ? 'up' : 'down'" :size="24" />
        </SwIconButton>
      </div>
    </div>

    <transition name="filter-collapse">
      <div v-if="isFilterVisible" class="self-stretch pt-6">
        <div class="space-y-4">
          <div class="self-stretch inline-flex justify-start items-start gap-2">
            <div class="flex-1 pt-[3px]">
              <SwSwitchButton
                :model-value="currentFilterData"
                @update:model-value="handleRadioUpdate"
                :name="props.filter.code"
                :aria-label="props.filter.label"
                :label="props.filter.label"
                :description="props.description || 'free delivery'"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth collapse/expand for filter options */
.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition: max-height 240ms ease, opacity 200ms ease;
  overflow: hidden;
}
.filter-collapse-enter-from,
.filter-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.filter-collapse-enter-to,
.filter-collapse-leave-from {
  max-height: 800px; /* large enough to contain options */
  opacity: 1;
}
</style>
