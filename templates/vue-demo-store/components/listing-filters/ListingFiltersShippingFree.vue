<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      id: string;
      code: string;
      label: string;
      name: string;
    }
  "
>
import type {
  AggregationFilterEntity,
  EntitiesAggregation,
  MaxAggregation,
  PriceAggregation,
} from "@shopware-pwa/types";
import { computed } from "vue";

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    [key: string]:
      | EntitiesAggregation<AggregationFilterEntity>
      | PriceAggregation
      | MaxAggregation
      | number;
  };
}>();

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();
const currentFilterData = computed(
  () => !!props.selectedFilters[props.filter?.code],
);
const onChangeOption = (): void => {
  emits("select-value", {
    code: props.filter?.code,
    value: !currentFilterData.value,
  });
};

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isFilterVisible.value = false));
</script>

<template>
  <div class="border-b border-secondary-200 py-6 px-5">
    <h3 class="-my-3 flow-root">
      <button
        type="button"
        class="flex w-full items-center justify-between bg-white py-2 text-base text-secondary-400 hover:text-secondary-500"
        @click="toggle"
      >
        <span class="font-medium text-secondary-900 text-left">{{
          props.filter.label
        }}</span>
        <span class="ml-6 flex items-center">
          <i
            :class="[
              !isFilterVisible
                ? 'i-carbon-chevron-down'
                : 'i-carbon-chevron-up',
            ]"
          />
        </span>
      </button>
    </h3>
    <transition name="fade" mode="out-in">
      <div v-show="isFilterVisible" id="filter-section-0" class="pt-6">
        <div class="space-y-4">
          <div class="flex items-center" @click="onChangeOption()">
            <input
              :id="`filter-mobile-${props.filter.id || props.filter.code}`"
              :checked="currentFilterData"
              :name="props.filter.name"
              :value="props.filter.name"
              type="checkbox"
              class="h-4 w-4 border-secondary-300 rounded text-indigo-600 focus:ring-indigo-500"
            />

            <label
              :for="`filter-mobile-${props.filter.id || props.filter.code}`"
              class="ml-3 text-secondary-600"
            >
              {{ props.filter.label }}
            </label>
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
</style>
