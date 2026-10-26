<script setup lang="ts">
import { getTranslatedProperty } from "@shopware/helpers";

import type { Schemas } from "#shopware";

defineOptions({
  name: "CheckoutOrderAddress",
});

const { address } = defineProps<{
  address: Schemas["OrderAddress"];
  label: string;
}>();

const countryName = computed(() =>
  address.country ? getTranslatedProperty(address.country, "name") : "",
);
</script>
<template>
  <div>
    <h3 class="text-surface-on-surface font-bold leading-normal mb-3">
      {{ label }}
    </h3>
    <address
      class="not-italic p-4 bg-brand-secondary flex flex-col justify-start items-start gap-0.5"
    >
      <div class="text-surface-on-surface text-base leading-normal">
        {{ address.firstName }} {{ address.lastName }}
      </div>
      <div class="text-surface-on-surface text-base leading-normal">
        {{ address.street }}
      </div>
      <div class="text-surface-on-surface text-base leading-normal">
        {{ address.zipcode }} {{ address.city }}
      </div>
      <div
        v-if="countryName"
        class="text-surface-on-surface text-base leading-normal"
      >
        {{ countryName }}
      </div>
    </address>
  </div>
</template>
