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
import ChevronIcon from "@cms-assets/chevron-down-xs.svg";
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

const handleRadioUpdate = (val: string | null | boolean) => {
  emits("select-value", { code: props.filter.code, value: !!val });
};
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-3">
    <div class="self-stretch py-3 border-b border-outline-outline-variant flex justify-between items-center">
      <div class="flex-1 flex justify-start items-center gap-2.5">
        <div class="flex-1 text-surface-on-surface text-base font-bold leading-normal">
          {{ props.filter.label }}
        </div>
      </div>
      <SwIconButton type="ghost" @click="toggle" :aria-label="isFilterVisible ? 'Collapse filter' : 'Expand filter'">
        <ChevronIcon :class="{ 'rotate-180': isFilterVisible }" class="w-6 h-6 transition-transform" />
      </SwIconButton>
    </div>

    <div v-show="isFilterVisible" class="self-stretch pt-6">
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
</style>
