<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      code: string;
      label: string;
    }
  "
>
import type {
  EntitiesAggregation,
  AggregationFilterEntity,
  PriceAggregation,
  MaxAggregation,
} from "@shopware-pwa/types";
import { computed, ref } from "vue";

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: {
    [key: string]:
      | EntitiesAggregation<AggregationFilterEntity>
      | PriceAggregation
      | MaxAggregation
      | number;
    rating: number;
  };
}>();
const isHoverActive = ref(false);
const hoveredIndex = ref(0);
const displayedScore = computed(() =>
  isHoverActive.value ? hoveredIndex.value : props.selectedFilters?.rating || 0,
);

const hoverRating = (key: number) => {
  hoveredIndex.value = key;
  isHoverActive.value = true;
};
const onChangeRating = () => {
  const newValue =
    props.selectedFilters?.rating !== hoveredIndex.value
      ? hoveredIndex.value
      : undefined;
  emits("select-value", { code: props.filter?.code, value: newValue });
};

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};
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
      <div v-show="isFilterVisible">
        <div class="space-y-6 mt-4">
          <div class="flex">
            <div
              v-for="i in 5"
              :key="i"
              class="h-6 w-6 c-yellow-500"
              :class="{
                'i-carbon-star-filled': displayedScore >= i,
                'i-carbon-star': displayedScore < i,
              }"
              @mouseleave="isHoverActive = false"
              @click="onChangeRating()"
              @mouseover="hoverRating(i)"
            />
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
