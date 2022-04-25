
<script setup lang="ts">
import { debounce } from "@shopware-pwa/helpers"
const $emits = defineEmits(["select-value"]);
const $props = defineProps(["filter"])

const prices = reactive<{min: number, max: number}>({
  min: $props.filter?.min,
  max: $props.filter?.max,
})

 watch(() => prices.min, debounce((newPrice: number, oldPrice: number) => {
  if (newPrice == oldPrice) return;
  $emits("select-value", {
    code: "min-price",
    value: newPrice,
  })
 }, 1000)
 )

watch(() => prices.max, debounce((newPrice: number, oldPrice: number) => {
  if (newPrice == oldPrice) return;
    $emits("select-value", {
        code: "max-price",
        value: newPrice,
    })
  }, 1000)
 )

</script>

<template>

<label for="company-website" class="block text-sm font-medium text-gray-700"> {{ filter.label }} </label>
<div class="mt-2 flex">
  <div class="w-1/2 flex rounded-md mr-4">
    <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"> min </span>
    <input v-model="prices.min" type="number" name="min-price" id="min-price" class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300" :placeholder="prices.min">
  </div>
  <div class="w-1/2 flex rounded-md ">
    <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"> max </span>
    <input v-model="prices.max" type="number" name="max-price" id="max-price" class="pl-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border border-gray-300" :placeholder="prices.max">
  </div>
</div>
</template>
