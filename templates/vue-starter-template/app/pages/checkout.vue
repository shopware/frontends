<script setup lang="ts">
const { cart } = useCart();
const {
  shippingMethods,
  getShippingMethods,
  paymentMethods,
  getPaymentMethods,
} = useCheckout();

const selectedShippingMethod = ref<string | null>(null);
const selectedPaymentMethod = ref<string | null>(null);

// const { refreshSessionContext } = useSessionContext();

// onMounted(() => {
//   refreshSessionContext();
// });

const canPlaceOrder = computed(
  () => selectedShippingMethod.value && selectedPaymentMethod.value,
);

onMounted(() => {
  getShippingMethods();
  getPaymentMethods();
});

function handleRemoveItem(id: string) {
  console.log(id);
}

function handleUpdateQuantity(id: string, quantity: number) {
  console.log(id, quantity);
}

function handlePlaceOrder() {
  console.log("place order");
}
</script>
<template>
  <div class="container mx-auto">
    <h1 class="text-10 my-20 font-['Noto_Serif']">
      {{ $t("checkout.title") }}
    </h1>
    <div class="flex gap-20 justify-between">
      <div class="w-1/2">
        {{ selectedShippingMethod }}
        <CheckoutStepHeader :step="1" label="Shipping address">
          <CheckoutCustomerAddress />
        </CheckoutStepHeader>
        <CheckoutStepHeader :step="2" label="Shipping">
          <CheckoutShippingMethods
            :shippingMethods="shippingMethods"
            v-model:selectedShippingMethod="selectedShippingMethod"
          />
        </CheckoutStepHeader>
        <CheckoutStepHeader :step="3" label="Payment information">
          <CheckoutPaymentMethods
            :paymentMethods="paymentMethods"
            v-model:selectedPaymentMethod="selectedPaymentMethod"
          />
        </CheckoutStepHeader>
        <FormBaseButton
          :label="$t('checkout.placeOrderButton')"
          @click="handlePlaceOrder"
          :disabled="!canPlaceOrder"
        />
      </div>
      <div class="w-1/2">
        <CheckoutSummaryBox
          v-if="cart"
          :cart="cart"
          @remove="handleRemoveItem"
          @updateQuantity="handleUpdateQuantity"
        />
      </div>
    </div>
  </div>
</template>
