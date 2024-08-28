<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import { useB2bQuoteManagement, useUser } from "@shopware-pwa/composables-next";
import { useRoute } from "vue-router";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Timeline from "primevue/timeline";

const { isLoggedIn } = useUser();
const quote = ref();
const changeRequest = ref("");
const declineComment = ref("");
const { getQuote, requestChangeQuote, declineQuote, requestQuote } =
  useB2bQuoteManagement();
const route = useRoute();

onBeforeMount(async () => {
  quote.value = await getQuote(route.params.id as string);
});

const handleChangeRequest = async () => {
  await requestChangeQuote(quote.value.id, changeRequest.value);
  changeRequest.value = "";
  quote.value = await getQuote(route.params.id as string);
};

const handleDecline = async () => {
  declineQuote(quote.value.id, declineComment.value);
  declineComment.value = "";
};

const handleRequestQuote = async () => {
  requestQuote(quote.value.id);
};

const activeQuote = computed(() => {
  return quote?.value.stateMachineState?.technicalName === "replied";
});
const refreshQuote = async () => {
  quote.value = await getQuote(route.params.id as string);
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
            <tr
              v-for="taxRule in quote?.price.calculatedTaxes"
              :key="taxRule.tax"
            >
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                VAT ({{ taxRule.tax }}%)
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
          <Textarea
            v-model="declineComment"
            rows="5"
            cols="30"
            :disabled="!activeQuote"
          />
          <Button
            label="Decline quote"
            :disabled="!activeQuote"
            @click="handleDecline"
          />
        </div>
      </div>
    </div>
    <hr class="my-10" />
    <div>
      <h2>Message history</h2>
      <Timeline :value="quote.comments">
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
