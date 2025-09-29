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
import { useCmsTranslations } from "@shopware/composables";
import { onClickOutside, useDebounceFn } from "@vueuse/core";
import { defu } from "defu";
import { onBeforeUnmount } from "vue";
import { onMounted, reactive, ref, watch } from "vue";
import type { Schemas } from "#shopware";

const emits =
  defineEmits<
    (e: "select-value", value: { code: string; value: unknown }) => void
  >();

const props = defineProps<{
  filter: ListingFilter;
  selectedFilters: Schemas["ProductListingResult"]["currentFilters"];
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
translations = defu(useCmsTranslations(), translations) as Translations;

const prices = reactive<{ min: number; max: number }>({
  min: 0,
  max: 0,
});

onMounted(() => {
  prices.min = Math.floor(
    props.selectedFilters.price.min ?? props.filter?.min ?? 0,
  );
  prices.max = Math.floor(
    props.selectedFilters.price.max ?? props.filter?.max ?? 0,
  );
});

const isFilterVisible = ref<boolean>(false);
const toggle = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const dropdownElement = ref(null);
onClickOutside(dropdownElement, () => {
  isFilterVisible.value = false;
});

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

// Slider drag logic
let dragging: "min" | "max" | null = null;
let sliderRect: DOMRect | null = null;

function startDrag(type: "min" | "max", event: MouseEvent) {
  dragging = type;
  const slider = (event.target as HTMLElement).closest(".relative.w-64.h-10");
  if (slider) {
    sliderRect = slider.getBoundingClientRect();
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  }
}

function onDrag(event: MouseEvent) {
  if (!dragging || !sliderRect) return;
  const min = props.filter.min ?? 0;
  const max = props.filter.max ?? 100;
  const percent = Math.min(
    Math.max((event.clientX - sliderRect.left) / sliderRect.width, 0),
    1,
  );
  const value = Math.round(min + percent * (max - min));
  if (dragging === "min") {
    if (value < min || value > prices.max) return;
    prices.min = value;
  } else {
    if (value > max || value < prices.min) return;
    prices.max = value;
  }
}

function stopDrag() {
  dragging = null;
  sliderRect = null;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
}

onBeforeUnmount(() => {
  stopDrag();
});
</script>

<template>
  <div class="self-stretch flex flex-col justify-start items-start gap-3">
    <div data-icon="true" data-level="1" data-state="Default" class="self-stretch flex flex-col justify-center items-center">
      <div class="self-stretch py-3 border-b border-outline-outline-variant inline-flex justify-start items-center gap-1">
        <div class="flex-1 flex justify-start items-center gap-2.5">
          <div class="flex-1 justify-start text-surface-on-surface text-base font-bold font-['Inter'] leading-normal">
            {{ props.filter.label }}
          </div>
        </div>
  <div class="w-6 h-6 relative">

          <button @click="toggle" class="w-full h-full flex items-center justify-center focus:outline-none bg-transparent">
            <span v-if="!isFilterVisible" class="i-carbon-chevron-down w-5 h-5"></span>
            <span v-else class="i-carbon-chevron-up w-5 h-5"></span>
          </button>
        </div>
      </div>
    </div>
    <div v-show="isFilterVisible" :id="props.filter.code" class="self-stretch flex flex-col justify-start items-start gap-2.5">
  <div data-state="Default" data-type="Range selection" class="self-stretch flex flex-col justify-start items-start gap-1">
        <div class="self-stretch inline-flex justify-between items-center gap-2">
          <div class="w-16 h-10 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-center items-start gap-2.5">
            <input
              type="number"
              :placeholder="translations.listing.min"
              v-model.number="prices.min"
              class="w-full bg-transparent border-none outline-none text-surface-on-surface text-sm font-normal font-['Inter'] leading-tight"
              @change="emits('select-value', { code: props.filter.code, value: { min: prices.min, max: prices.max } })"
              :min="props.filter.min"
              :max="prices.max"
            />
          </div>
          <div class="w-16 h-10 px-2 py-1 rounded-lg outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-center items-start gap-2.5">
            <input
              type="number"
              :placeholder="translations.listing.max"
              v-model.number="prices.max"
              class="w-full bg-transparent border-none outline-none text-surface-on-surface text-sm font-normal font-['Inter'] leading-tight"
              @change="emits('select-value', { code: props.filter.code, value: { min: prices.min, max: prices.max } })"
              :min="prices.min"
              :max="props.filter.max"
            />
          </div>
        </div>
        <!-- Custom slider UI -->
        <div class="relative w-64 h-10 mt-2 mx-auto flex items-center select-none">
          <!-- Track -->
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-surface-surface-container-highest rounded-full"></div>
          <!-- Active range -->
          <div
            class="absolute top-1/2 -translate-y-1/2 h-2 bg-surface-surface-primary rounded-full"
            :style="{
              left: ((prices.min - (props.filter.min ?? 0)) / ((props.filter.max ?? 100) - (props.filter.min ?? 0))) * 100 + '%',
              width: ((prices.max - prices.min) / ((props.filter.max ?? 100) - (props.filter.min ?? 0))) * 100 + '%',
            }"
          ></div>
          <!-- Min thumb -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-brand-primary rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer"
            :style="{
              left: `calc(${((prices.min - (props.filter.min ?? 0)) / ((props.filter.max ?? 100) - (props.filter.min ?? 0))) * 100}% - 10px)`
            }"
            @mousedown.prevent="startDrag('min', $event)"
          ></div>
          <!-- Max thumb -->
          <div
            class="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-brand-primary rounded-full shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)] cursor-pointer"
            :style="{
              left: `calc(${((prices.max - (props.filter.min ?? 0)) / ((props.filter.max ?? 100) - (props.filter.min ?? 0))) * 100}% - 10px)`
            }"
            @mousedown.prevent="startDrag('max', $event)"
          ></div>
        </div>
      </div>
    </div>
    </div>
    </template>