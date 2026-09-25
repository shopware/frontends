<script setup lang="ts">
import {
  usePrice,
  useProductPrice,
  useSessionContext,
} from "@shopware/composables";
import { computed, toRef } from "vue";

import type { Schemas } from "#shopware";

const { product } = defineProps<{ product: Schemas["Product"] }>();

const { getFormattedPrice } = usePrice();
const { taxState } = useSessionContext();
const {
  price,
  unitPrice,
  displayFrom,
  displayFromVariants,
  tierPrices,
  referencePrice,
  hasListPrice,
  regulationPrice,
} = useProductPrice(toRef(() => product));

// displayFromVariants is number | false | undefined. A free variant is 0,
// which truthiness would throw away, so narrow on the numeric case.
const variantsFrom = computed(() =>
  typeof displayFromVariants.value === "number"
    ? displayFromVariants.value
    : undefined,
);

const showFrom = computed(
  () => displayFrom.value || variantsFrom.value !== undefined,
);

const displayedPrice = computed(() => variantsFrom.value ?? unitPrice.value);

const taxNote = computed(() => {
  if (taxState.value === "tax-free") return "tax free";
  if (taxState.value === "gross") return "incl. tax";
  return taxState.value === "net" ? "excl. tax" : "";
});
</script>

<template>
  <div aria-live="polite">
    <p>
      <span v-if="showFrom">from </span>
      <span class="sr-only">Current price</span>
      <strong>{{ getFormattedPrice(displayedPrice) }}</strong>
      <small> {{ taxNote }}</small>
    </p>

    <p v-if="hasListPrice && price?.listPrice">
      <span class="sr-only">Previous price</span>
      <del>{{ getFormattedPrice(price.listPrice.price) }}</del>
      <span> Save {{ price.listPrice.percentage }}%</span>
    </p>

    <p v-if="regulationPrice">
      Lowest price in the last 30 days
      {{ getFormattedPrice(regulationPrice) }}
    </p>

    <p v-if="referencePrice">
      {{ getFormattedPrice(referencePrice.price) }} per
      {{ referencePrice.referenceUnit }} {{ referencePrice.unitName }}
    </p>

    <table v-if="tierPrices.length > 1">
      <caption>
        Quantity discounts
      </caption>
      <thead>
        <tr>
          <th scope="col">Quantity</th>
          <th scope="col">Unit price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tier in tierPrices" :key="tier.quantity">
          <th scope="row">{{ tier.label }}</th>
          <td>{{ getFormattedPrice(tier.unitPrice) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
