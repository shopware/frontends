<script setup>
import {getTranslatedProperty} from "@shopware-pwa/helpers";
const $props = defineProps(["content"])
const cmsPage = inject("cms-page")

// default data from cms
const productNameSlot = $props.content?.slots.find(({type}) => type === "product-name")
const productManufacturerSlot = $props.content?.slots?.find(({type}) => type === "manufacturer-logo");
const productNameSlotContent = computed(() => productNameSlot?.data?.content)
const productManufacturerSlotContent = computed(() => productManufacturerSlot?.data?.manufacturer?.name)

// fallback values from injected product object
const productName = computed(() => productNameSlotContent.value || getTranslatedProperty(cmsPage.value?.product, "name"))
const manufacturerName = computed(() => productManufacturerSlotContent.value || getTranslatedProperty(cmsPage.value?.product?.manufacturer, "name"))
</script>

<template>
  <div class="pt-8 flex flex-row">
    <h1 class="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl basis-4/6">{{ productName }}</h1>
    <div class="basis-2/6 text-right">{{ manufacturerName }}</div>
  </div>
</template>