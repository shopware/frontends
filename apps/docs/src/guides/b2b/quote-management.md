---
head:
  - - meta
    - name: og:title
      content: "B2B Quote Management"
  - - meta
    - name: og:description
      content: "In this chapter, you will learn how to use quote management"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/B2B%20Quote%20Management.png?fontSize=150px"
nav:
  position: 10
---

# B2B Quote Management

In this chapter you will learn how to

- Request new quote
- Fetch a list of quote and display detail
- Decline quote
- Request change in quote
- Change payment or shipping in quote
- Create a order from a quote

## Quick reference

- [useB2bQuoteManagement](../../packages/composables/useB2bQuoteManagement) is a composable used for a quote management

## Request new quote

The "Request New Quote" feature allows B2B users to request a custom quote for their current basket. This is particularly useful for large or complex orders where standard pricing may not apply, or special discounts may be negotiated.

This feature enhances the B2B shopping experience by providing flexibility in pricing and order customization. It also allows for direct communication between the buyer and seller, facilitating better negotiation and understanding of needs.

:::warning
Cart cannot be empty
:::

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useCart, useB2bQuoteManagement } from "@shopware/composables";
const { cartItems } = useCart();
const { requestQuote } = useB2bQuoteManagement();
const comment = ref("");
const handleRequestQuote = async () => {
  await requestQuote(comment.value);
};
</script>
<template>
  <textarea v-model="comment"> </textarea>
  <button :disabled="cartItems.length <= 0" @click="handleRequestQuote">
    Request quote
  </button>
</template>
```

## Fetch a list of quote and display detail

This feature allows users to retrieve a list of all their requested quotes or quotes created by the admin.

```vue
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useB2bQuoteManagement } from "@shopware/composables";
import type { Schemas } from "#shopware";
const quotesList = ref<Schemas["Quote"][]>([]);
const { getQuoteList } = useB2bQuoteManagement();
onBeforeMount(async () => {
  quotesList.value = await getQuoteList();
});
</script>
<template>
  <table>
    <thead>
      <tr>
        <th>Quote #</th>
        <th>Created at</th>
        <th>Valid until</th>
        <th>Grand total</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="quote in quotesList" :key="quote.id">
        <td>{{ quote.quoteNumber }}</td>
        <td>{{ quote.createdAt }}</td>
        <td>{{ quote.expirationDate }}</td>
        <td>
          {{ quote.price?.totalPrice }}
        </td>
        <td>
          {{ quote.stateMachineState?.translated?.name }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

## Decline quote

The "Decline Quote" feature provides users with the ability to reject a quote that doesn't meet their requirements or expectations. By declining a quote, users can communicate their dissatisfaction with the proposed terms, prompting the sales team to review and potentially adjust the quote to better meet the user's needs. This feature ensures that the negotiation process is interactive and that the final agreement is satisfactory to both parties.

The comment is attached to a single quote line item in a draft version of the quote, so pick the line item the comment is about and create the draft version first. `createDraftQuoteVersion` returns the `versionId` the endpoint expects — this is not the `versionId` property of the quote entity.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useB2bQuoteManagement } from "@shopware/composables";
const declineComment = ref("");
const declineLineItemId = ref<string>();
const quoteId = ref("example-id");
const { declineQuoteWithComment, createDraftQuoteVersion } =
  useB2bQuoteManagement();
const handleDecline = async () => {
  const lineItemId = declineLineItemId.value;
  if (!lineItemId) return;

  const versionId = await createDraftQuoteVersion(quoteId.value);

  await declineQuoteWithComment(quoteId.value, {
    comment: declineComment.value,
    lineItemId,
    versionId,
  });
  declineComment.value = "";
};
</script>
<template>
  <form @submit.prevent="handleDecline">
    <textarea v-model="declineComment"> </textarea>
    <button>Decline</button>
  </form>
</template>
```

## Request change in quote

The "Request Change in Quote" feature empowers users to actively participate in the negotiation process. If a quote doesn't meet their expectations or requirements, users can request specific changes to the quote. This could involve adjustments to pricing, quantities, delivery terms, or product specifications. By requesting a change, users can ensure that the final agreement is tailored to their needs, fostering a more collaborative and satisfactory business relationship.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useB2bQuoteManagement } from "@shopware/composables";
const quoteId = ref("example-id");
const changeRequest = ref("");
const { requestChangeQuote } = useB2bQuoteManagement();
const handleChangeRequest = async () => {
  await requestChangeQuote(quoteId.value, changeRequest.value);
  changeRequest.value = "";
};
</script>
<template>
  <form @submit.prevent="handleChangeRequest">
    <textarea v-model="changeRequest"> </textarea>
    <button type="submit">Send</button>
  </form>
</template>
```

## Change payment or shipping in quote

The "Change Payment or Shipping in Quote" feature provides users with the flexibility to modify the payment method or shipping details in a quote.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useB2bQuoteManagement } from "@shopware/composables";
const quoteId = ref("example-id");
const { changeShippingMethod, changePaymentMethod } = useB2bQuoteManagement();
const handleChangeMethods = async () => {
  await changeShippingMethod(quoteId.value, "example-shipping-id");
  await changePaymentMethod(quoteId.value, "example-payment-id");
};
</script>
<template>
  <button @click="handleChangeMethods">Change methods</button>
</template>
```

## Create an order from a quote

The "Create an Order from a Quote" feature allows users to seamlessly convert a negotiated quote into a formal order. Once a quote has been reviewed and agreed upon, users can use this feature to initiate the ordering process directly from the quote.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useB2bQuoteManagement } from "@shopware/composables";
const quoteId = ref("example-id");
const comment = ref("");
const { createOrderFromQuote } = useB2bQuoteManagement();
const handleCreateOrder = async () => {
  await createOrderFromQuote(quoteId.value, comment.value);
};
</script>
<template>
  <form @submit.prevent="handleCreateOrder">
    <textarea v-model="comment"> </textarea>
    <button type="submit">Create order</button>
  </form>
</template>
```
