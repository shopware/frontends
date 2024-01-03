<script
  setup
  lang="ts"
  generic="
    ListingFilter extends {
      code: string;
      min?: number;
      max?: number;
      label: string;
    }
  "
>
import { reactive, ref, watch } from "vue";

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
}>();

type Translations = {
  listing: {
    min: string;
    max: string;
  };
};
let translations: Translations = {
  listing: {
    min: "Min",
    max: "Max",
  },
};

const prices = reactive<{ min: number; max: number }>({
  min: props.filter?.min || 0,
  max: props.filter?.max || 0,
});

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => (isFilterVisible.value = false));

function onMinPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice === oldPrice || oldPrice === 0) return;
  emits("select-value", {
    code: "min-price",
    value: newPrice,
  });
}
const debounceMinPriceUpdate = useDebounceFn(onMinPriceChange, 500);
watch(() => prices.min, debounceMinPriceUpdate);

function onMaxPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice === oldPrice || oldPrice === 0) return;
  emits("select-value", {
    code: "max-price",
    value: newPrice,
  });
}
const debounceMaxPriceUpdate = useDebounceFn(onMaxPriceChange, 500);
watch(() => prices.max, debounceMaxPriceUpdate);
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
      <div v-show="isFilterVisible" class="space-y-6 mt-5">
        <div class="mt-2 flex">
          <div class="w-1/2 flex rounded-md mr-4">
            <span
              class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-secondary-300 bg-secondary-50 text-secondary-500 text-sm"
            >
              {{ translations.listing.min }}
            </span>
            <input
              id="min-price"
              v-model="prices.min"
              type="number"
              name="min-price"
              class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-secondary-300"
              :placeholder="prices.min?.toString()"
            />
          </div>
          <div class="w-1/2 flex rounded-md">
            <span
              class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-secondary-300 bg-secondary-50 text-secondary-500 text-sm"
            >
              {{ translations.listing.max }}
            </span>
            <input
              id="max-price"
              v-model="prices.max"
              type="number"
              name="max-price"
              class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-secondary-300"
              :placeholder="prices.max?.toString()"
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
