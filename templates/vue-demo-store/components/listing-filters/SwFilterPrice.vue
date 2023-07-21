<script setup lang="ts">
import { ListingFilter } from "@shopware-pwa/types";
import SwRangeSlider from "../SwRangeSlider.vue";

const emits = defineEmits<{
  (e: "select-value", value: { code: string; value: unknown }): void;
}>();

const props = defineProps<{
  filter: ListingFilter;
}>();
const prices = reactive<{ min: number; max: number }>({
  min: props.filter?.min || 0,
  max: props.filter?.max || 0,
});

function onMinPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice == oldPrice) return;
  emits("select-value", {
    code: "min-price",
    value: newPrice,
  });
}

function onMaxPriceChange(newPrice: number, oldPrice: number) {
  if (newPrice == oldPrice) return;
  emits("select-value", {
    code: "max-price",
    value: newPrice,
  });
}

const handleChange = (value: any) => {
  if (value.type === 'start') {
    if (value.min == prices.min) return;
    emits("select-value", {
      code: "min-price",
      value: value.min,
    });
    prices.min = value.min;
  } else if (value.type === 'end') {
    if (value.max == prices.max) return;
    emits("select-value", {
      code: "max-price",
      value: value.max,
    });
    prices.max = value.max;
  }
}
</script>

<template>
  <div class="mb-8">
    <SwRangeSlider :min="+(props.filter?.min || 0)" :max="+(props.filter?.max || 0)" @change="handleChange"/>
  </div>
</template>
