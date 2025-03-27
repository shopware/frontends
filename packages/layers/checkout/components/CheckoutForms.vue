<script setup lang="ts">
const activeSection = ref(1);

const toggleSection = (sectionNumber) => {
  activeSection.value =
    sectionNumber === activeSection.value ? 0 : sectionNumber;
};

const isActive = (sectionNumber) => activeSection.value === sectionNumber;

const handleNextSection = (nextSection) => {
  activeSection.value = nextSection;
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div
      class="self-stretch justify-start text-Surface-On-Surface pb-10 text-4xl font-normal font-['Noto_Serif'] leading-[60px]">
      Checkout</div>
    <div class="flex flex-col md:flex-row gap-space-80 ">
      <!-- Left Column - Authentication Options -->
      <div class="w-full md:w-1/2 space-y-space-24">
        <div class="space-y-6">
          <CheckoutTab :number="1" title="Shipping address" :is-active="isActive(1)" @toggle="toggleSection(1)">
            <CheckoutShippingAddressForm @next="handleNextSection(2)" />
          </CheckoutTab>

          <CheckoutTab :number="2" title="Shipping" :is-active="isActive(2)" @toggle="toggleSection(2)">
            <CheckoutShippingMethodForm @next="handleNextSection(3)" />
          </CheckoutTab>

          <CheckoutTab :number="3" title="Payment information" :is-active="isActive(3)" @toggle="toggleSection(3)">
            <CheckoutPaymentInformationForm />
          </CheckoutTab>
        </div>
      </div>

      <!-- Right Column - Order Summary -->
      <div class="w-full md:w-1/2">
<div
          class="w-full self-stretch pb-6 bg-surface-surface outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-start items-start gap-20">
          <div
            class="self-stretch px-6 pt-4 pb-2 border-b border-outline-outline-variant inline-flex justify-center items-center gap-2.5">
            <div
              class="flex-1 justify-start text-Surface-On-Surface text-4xl font-normal font-['Noto_Serif'] leading-[60px]">
              Summary
            </div>
          </div>

          <div class="self-stretch px-6 flex flex-col justify-start items-start">
            <div v-if="count > 0"
              class="self-stretch pb-8 bg-surface-surface border-b border-outline-outline-variant inline-flex justify-start items-start gap-4 w-full">
              <CartItems />
            </div>
            <div v-else class="flex flex-col items-center justify-center h-40 text-center w-full">
              <ShoppingBag class="h-10 w-10 text-outline-outline mb-2" />
              <p class="text-outline-outline">Your cart is empty</p>
            </div>
          </div>
          <div class="self-stretch px-6 flex flex-col justify-start items-start">
            <CartSummary v-if="total" :subtotal="subtotal" :shipping="shipping" :total="total" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>