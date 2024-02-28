<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useB2bQuoteManagement } from "@shopware-pwa/composables-next";
import { useRoute } from "vue-router";

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
  requestChangeQuote(quote.value.id, changeRequest.value);
  changeRequest.value = "";
};

const handleDecline = async () => {
  declineQuote(quote.value.id, declineComment.value);
  declineComment.value = "";
};
</script>
<template>
  <div>
    <h1>Quote</h1>
    <!-- <pre>{{ quote }}</pre> -->
    <div class="flex">
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
                Requested at
              </td>
              <td class="py-3 px-4 text-left">[No data]</td>
            </tr>
            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Created by
              </td>
              <td class="py-3 px-4 text-left">[No data]</td>
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
              v-for="taxRule in quote.price.calculatedTaxes"
              :key="taxRule.tax"
            >
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                VAT ({{ taxRule.tax }}%)
              </td>
              <td class="py-3 px-4 text-left">{{ taxRule.price }}</td>
            </tr>

            <tr>
              <td class="py-3 px-4 text-left font-medium text-gray-600">
                Grand total (gross)
              </td>
              <td class="py-3 px-4 text-left"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <h2>Items</h2>
      <div v-for="item in quote.lineItems" :key="item.id">
        {{ item.label }}
      </div>
    </div>
    <div>
      <h2>Request changes</h2>
      <form @submit.prevent="handleChangeRequest">
        <textarea class="border" v-model="changeRequest"> </textarea>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>

    <form @submit.prevent="handleDecline">
      <textarea class="border" v-model="declineComment"> </textarea>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Decline
      </button>
    </form>

    <div>
      <h2>Message history</h2>
      <div>
        <div v-for="comment in quote.comments">
          {{ comment.comment }}
        </div>
      </div>
    </div>

    <button @click="handleRequestQuote">Request quote</button>
  </div>
</template>
