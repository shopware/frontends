<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import {
  useProductSearch,
  useCart,
  useB2bQuoteManagement,
} from "@shopware-pwa/composables-next";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Stepper from "primevue/stepper";
import StepPanels from "primevue/steppanels";
import StepList from "primevue/steplist";
import Message from "primevue/message";
import StepPanel from "primevue/steppanel";
import Step from "primevue/step";

const product = ref();
const requestComment = ref("");
const requested = ref(false);
const { requestQuote } = useB2bQuoteManagement();
const { search } = useProductSearch();
const { cartItems, refreshCart, addProduct } = useCart();

const proxyAddToCart = async (quantity: number = 1) => {
  await addProduct({ id: product.value?.id, quantity });
  refreshCart();
};
const handleCreateQuote = async () => {
  await requestQuote(requestComment.value);
  requested.value = true;
};
onBeforeMount(async () => {
  refreshCart();
  const productResponse = await search("85a0d7e39bdf49d0a6f6318c6e464cc1");
  product.value = productResponse.product;
});
</script>
<template>
  <Stepper value="1">
    <StepList>
      <Step value="1">Add product to the basket</Step>
      <Step value="2">Request quote</Step>
    </StepList>
    <StepPanels>
      <StepPanel v-slot="{ activateCallback }" value="1">
        <Message class="mb-5" severity="warn" :closable="false"
          >Quote can be requested only for not empty cart</Message
        >
        <template v-if="!cartItems.length">
          <Message severity="error" :closable="false"
            >Your cart is empty. Click "Add item"</Message
          >
          <div v-if="product" class="flex w-100 mt-10">
            <div
              class="mr-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-secondary-200"
            >
              <img
                :src="product.cover.media.thumbnails[0].url"
                class="h-full w-full object-cover object-center"
              />
            </div>
            <div class="flex flex-1 flex-col">
              <div>
                <div
                  class="flex flex-col lg:flex-row justify-between text-base font-medium text-secondary-900"
                >
                  <h3 class="text-base m-0">
                    {{ product.name }}
                  </h3>
                  <p class="flex gap-1">
                    {{ product.calculatedCheapestPrice.unitPrice }}
                  </p>
                </div>
              </div>
              <div class="flex flex-1 items-end justify-between text-sm">
                <input
                  value="1"
                  type="number"
                  :disabled="true"
                  name="quantity"
                  aria-label="Cart item quantity"
                  class="w-18 mt-1 inline-block py-2 px-3 border border-secondary-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <div class="flex">
                  <Button
                    icon="pi pi-shopping-cart"
                    label="Add item"
                    class="flex-auto md:flex-initial white-space-nowrap"
                    @click="proxyAddToCart(1)"
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <Message severity="success"
            >You have {{ cartItems.length }} items in cart. Click "Next"
            button</Message
          >
        </template>
        <div class="flex pt-4 justify-end">
          <Button
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="activateCallback('2')"
          />
        </div>
      </StepPanel>
      <StepPanel v-slot="{ activateCallback }" value="2">
        <Message severity="info" :closable="false"
          >You can add comment to your requested quote</Message
        >
        <template v-if="!requested">
          <div class="flex flex-col gap-2">
            <Textarea v-model="requestComment" rows="5" cols="30" />
            <Button label="Request quote" @click="handleCreateQuote" />
          </div>
        </template>
        <template v-else>
          <Message severity="success" :closable="false">
            Quote requested.
            <RouterLink :to="'/quotes'">CLICK HERE TO SEE THE LIST</RouterLink>
          </Message>
        </template>
        <div class="flex pt-4 justify-between">
          <Button
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="activateCallback('1')"
          />
        </div>
      </StepPanel>
    </StepPanels>
  </Stepper>
</template>
