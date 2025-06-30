<script setup lang="ts">
import {
  getShippingMethodDeliveryTime,
  getShippingMethodIcon,
} from "@shopware/helpers";
import type { Schemas } from "#shopware";

const { shippingMethods } = defineProps<{
  shippingMethods: Schemas["ShippingMethod"][];
}>();

const selectedShippingMethod = defineModel<string | null>(
  "selectedShippingMethod",
  {
    required: true,
  },
);
</script>
<template>
  <div class="border border-outline-outline divide-y-1 divide-outline-outline">
    <div
      v-for="shippingMethod in shippingMethods"
      :key="shippingMethod.id"
      class="p-4"
    >
      <label :for="shippingMethod.id" class="flex items-center gap-4">
        <div>
          <FormRadioButton
            :selected="selectedShippingMethod === shippingMethod.id"
            :id="shippingMethod.id"
            :value="shippingMethod.id"
            name="shipping-method"
            v-model="selectedShippingMethod"
          />
        </div>
        <div>
          <div class="text-surface-on-surface">
            {{ shippingMethod.translated.name }}
          </div>
          <div
            v-if="getShippingMethodDeliveryTime(shippingMethod)"
            class="self-stretch text-surface-on-surface-variant text-sm leading-[21px]"
          >
            {{ getShippingMethodDeliveryTime(shippingMethod) }}
          </div>
        </div>
        <div class="ml-auto">
          <NuxtImg :src="getShippingMethodIcon(shippingMethod)" height="32" />
        </div>
      </label>
    </div>
  </div>
</template>
