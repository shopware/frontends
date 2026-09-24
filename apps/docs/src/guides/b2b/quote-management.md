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

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/b2b/quote-management/request-new-quote.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { useCart, useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
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

<!-- /automd -->

## Fetch a list of quote and display detail

This feature allows users to retrieve a list of all their requested quotes or quotes created by the admin.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/b2b/quote-management/fetch-a-list-of-quote-and-display-detail.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref, onBeforeMount } from "vue";
const quotesList = ref([]);
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
          {{ quote.price.totalPrice }}
        </td>
        <td>
          {{ quote.stateMachineState.translated.name }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

<!-- /automd -->

## Decline quote

The "Decline Quote" feature provides users with the ability to reject a quote that doesn't meet their requirements or expectations. By declining a quote, users can communicate their dissatisfaction with the proposed terms, prompting the sales team to review and potentially adjust the quote to better meet the user's needs. This feature ensures that the negotiation process is interactive and that the final agreement is satisfactory to both parties.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/b2b/quote-management/decline-quote.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const declineComment = ref("");
const quote = ref("example-id");
const { declineQuote } = useB2bQuoteManagement();
const handleDecline = async () => {
  declineQuote(quote.value.id, declineComment.value);
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

<!-- /automd -->

## Request change in quote

The "Request Change in Quote" feature empowers users to actively participate in the negotiation process. If a quote doesn't meet their expectations or requirements, users can request specific changes to the quote. This could involve adjustments to pricing, quantities, delivery terms, or product specifications. By requesting a change, users can ensure that the final agreement is tailored to their needs, fostering a more collaborative and satisfactory business relationship.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/b2b/quote-management/request-change-in-quote.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quote = ref("example-id");
const changeRequest = ref("");
const { requestChangeQuote } = useB2bQuoteManagement();
const handleChangeRequest = async () => {
  requestChangeQuote(quote.value.id, changeRequest.value);
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

<!-- /automd -->

## Change payment or shipping in quote

The "Change Payment or Shipping in Quote" feature provides users with the flexibility to modify the payment method or shipping details in a quote.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/b2b/quote-management/change-payment-or-shipping-in-quote.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quote = ref("example-id");
const { changeShippingMethod, changePaymentMethod } = useB2bQuoteManagement();
changeShippingMethod(quote.value.id, "example-shipping-id");
changePaymentMethod(quote.value.id, "example-payment-id");
</script>
```

<!-- /automd -->

## Create an order from a quote

The "Create an Order from a Quote" feature allows users to seamlessly convert a negotiated quote into a formal order. Once a quote has been reviewed and agreed upon, users can use this feature to initiate the ordering process directly from the quote.

<!-- automd:file src="examples/docs-code-examples/src/generated/guides/b2b/quote-management/create-an-order-from-a-quote.vue" code lang="vue" no-name -->

```vue
<script setup lang="ts">
import { useB2bQuoteManagement } from "@shopware/composables";
import { ref } from "vue";
const quote = ref("example-id");
const comment = ref("");
const { createOrderFromQuote } = useB2bQuoteManagement();
const handleCreateOrder = async () => {
  await createOrderFromQuote(quote.value.id, comment.value);
};
</script>
<template>
  <template>
    <form @submit.prevent="handleCreateOrder">
      <textarea v-model="comment"> </textarea>
      <button type="submit">Create order</button>
    </form>
  </template>
</template>
```

<!-- /automd -->
