<script setup lang="ts">
import { defu } from "defu";

import { useCmsTranslations } from "#imports";
import type { Schemas } from "#shopware";

defineProps<{
  availableStock: number;
  minPurchase: number;
  deliveryTime?: Schemas["DeliveryTime"];
  restockTime?: number;
}>();

type Translations = {
  product: {
    deliveryTime: string;
    days: string;
    noAvailable: string;
  };
};

let translations: Translations = {
  product: {
    deliveryTime: "Available, delivery time",
    days: "days",
    noAvailable: "No longer available",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;
</script>
<template>
  <div class="inline-flex justify-start items-center gap-2">
    <div class="w-2 h-2 bg-states-success rounded-full" v-if="availableStock > 0"></div>
    <div class="w-2 h-2 bg-states-error rounded-full" v-else></div>
    <span v-if="availableStock >= minPurchase && deliveryTime">{{ translations.product.deliveryTime }} {{
      deliveryTime?.name }}
    </span>
    <span v-else-if="availableStock < minPurchase && deliveryTime && restockTime">
      {{ translations.product.deliveryTime }} {{ restockTime }}
      {{ translations.product.days }} {{ deliveryTime?.name }}</span>
    <span v-else>{{ translations.product.noAvailable }}</span>
  </div>
</template>