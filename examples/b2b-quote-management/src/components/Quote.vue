<script setup lang="ts">
import { useB2bQuoteManagement, useUser } from "@shopware/composables";
import Button from "primevue/button";
import Message from "primevue/message";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Timeline from "primevue/timeline";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

import type { Schemas } from "#shopware";

import Login from "./Login.vue";

const { isLoggedIn } = useUser();
const quote = ref<Schemas["Quote"]>();
const changeRequest = ref("");
const declineComment = ref("");
// The API ties a decline comment to a single quote line item, so the customer
// has to pick the one their objection is about.
const declineLineItemId = ref<string>();
const declineError = ref("");
const {
  getQuote,
  requestChangeQuote,
  declineQuoteWithComment,
  requestQuote,
  createDraftQuoteVersion,
} = useB2bQuoteManagement();
const route = useRoute();

const quoteId = computed(() => route.params.id as string);

const refreshQuote = async () => {
  quote.value = await getQuote(quoteId.value);
};

onBeforeMount(refreshQuote);

const lineItemOptions = computed(() =>
  (quote.value?.lineItems ?? []).map((lineItem) => ({
    label: `${lineItem.label} (${lineItem.quantity}x)`,
    value: lineItem.id,
  })),
);

// `Quote.price.calculatedTaxes` is described as a bare `object` in the Store API
// schema, so it arrives untyped. At runtime it has the same shape as
// `CalculatedPrice.calculatedTaxes`.
const calculatedTaxes = computed(
  () =>
    (quote.value?.price?.calculatedTaxes ?? []) as unknown as NonNullable<
      Schemas["CalculatedPrice"]["calculatedTaxes"]
    >,
);

const activeQuote = computed(
  () => quote.value?.stateMachineState?.technicalName === "replied",
);

const canDecline = computed(
  () =>
    activeQuote.value &&
    !!declineLineItemId.value &&
    declineComment.value.trim().length > 0,
);

const handleChangeRequest = async () => {
  if (!quote.value) return;

  await requestChangeQuote(quote.value.id, changeRequest.value);
  changeRequest.value = "";
  await refreshQuote();
};

const handleDecline = async () => {
  const lineItemId = declineLineItemId.value;
  if (!quote.value || !lineItemId) return;

  declineError.value = "";

  try {
    // `versionId` is the draft version created for this edit, not the
    // `versionId` property of the quote entity.
    const versionId = await createDraftQuoteVersion(quote.value.id);

    await declineQuoteWithComment(quote.value.id, {
      comment: declineComment.value,
      lineItemId,
      versionId,
    });

    declineComment.value = "";
    declineLineItemId.value = undefined;
    await refreshQuote();
  } catch (error) {
    declineError.value =
      error instanceof Error ? error.message : "Could not decline the quote.";
  }
};

const handleRequestQuote = async () => {
  if (!quote.value) return;

  await requestQuote(quote.value.id);
};
</script>
<template>
  <div v-if="isLoggedIn">
    <div class="flex gap-20">
      <div>
        <h2>Details</h2>
        <table class="w-full text-sm leading-5">
          <tbody>
            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Created at
              </td>
              <td class="py-3 px-4 text-left">
                {{ quote?.createdAt }}
              </td>
            </tr>

            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Valid until
              </td>
              <td class="py-3 px-4 text-left">{{ quote?.expirationDate }}</td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Order number
              </td>
              <td class="py-3 px-4 text-left">
                {{ quote?.orderId || "-" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2>Cart summary</h2>
        <table class="w-full text-sm leading-5">
          <tbody>
            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Subtotal (net)
              </td>
              <td class="py-3 px-4 text-left">
                {{ quote?.subtotalNet }}
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Discount
              </td>
              <td class="py-3 px-4 text-left">
                {{ quote?.totalDiscount }}
              </td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Total (net)
              </td>
              <td class="py-3 px-4 text-left">
                {{ quote?.amountTotal }}
              </td>
            </tr>
            <tr v-for="taxRule in calculatedTaxes" :key="taxRule.taxRate">
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                VAT ({{ taxRule.taxRate }}%)
              </td>
              <td class="py-3 px-4 text-left">{{ taxRule.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <hr class="my-10" />
    <div class="flex justify-between gap-20">
      <div class="w-50%">
        <h2>Request changes</h2>
        <div class="flex flex-col gap-2">
          <Textarea
            v-model="changeRequest"
            rows="5"
            cols="30"
            :disabled="!activeQuote"
          />
          <Button
            label="Request changes"
            :disabled="!activeQuote"
            @click="handleChangeRequest"
          />
        </div>
      </div>

      <div class="w-50%">
        <h2>Decline quote</h2>
        <div class="flex flex-col gap-2">
          <Select
            v-model="declineLineItemId"
            :options="lineItemOptions"
            option-label="label"
            option-value="value"
            placeholder="Select the line item this comment is about"
            :disabled="!activeQuote || !lineItemOptions.length"
          />
          <Textarea
            v-model="declineComment"
            rows="5"
            cols="30"
            :disabled="!activeQuote"
          />
          <Message v-if="declineError" severity="error" :closable="false">
            {{ declineError }}
          </Message>
          <Button
            label="Decline quote"
            :disabled="!canDecline"
            @click="handleDecline"
          />
        </div>
      </div>
    </div>
    <hr class="my-10" />
    <div>
      <h2>Message history</h2>
      <Timeline :value="quote?.comments ?? []">
        <template #opposite="slotProps">
          <small class="p-text-secondary">{{ slotProps.item.createdAt }}</small>
        </template>
        <template #content="slotProps">
          {{ slotProps.item.comment }}
        </template>
      </Timeline>
    </div>
    <hr class="my-10" />
    <Button
      class="w-full"
      label="Request quot"
      @click="handleRequestQuote"
      :disabled="!activeQuote"
    />
  </div>
  <Login v-else @success="refreshQuote" />
</template>
