<script setup lang="ts">
import { ShoppingBag } from "lucide-vue-next";
const { count, cart } = useCart();
const subtotal = computed(() => cart.value?.price?.subtotal || 0);
const shipping = computed(() => 0);
const total = computed(() => cart.value?.price?.totalPrice || 0);
</script>

<template>
  <div class="max-w-7xl mx-auto p-6">
    <div
      class="self-stretch justify-start text-Surface-On-Surface pb-10 text-4xl font-normal font-['Noto_Serif'] leading-[60px]">
      Begin Checkout</div>
    <div class="flex flex-col md:flex-row gap-space-80 ">
      <!-- Left Column - Authentication Options -->
      <div class="w-full md:w-1/2 space-y-space-24">
        <div class="border-stroke-border-s border-outline-outline-variant rounded-radius-4">
          <div class="p-space-24 border border-outline-outline-variant">
            <h2 class="text-scale-04 font-medium text-surface-on-surface">Express Checkout</h2>
          </div>
          <div
            class="p-space-24 flex flex-col sm:flex-row gap-space-16 border-outline-outline-variant border border-t-0">
            <button
              class="bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary w-full py-space-12 px-space-16 rounded-radius-button font-medium">
              Login customer account
            </button>
            <button
              class="bg-[#ffc439] hover:bg-[#ffc439]/90 text-[#003087] w-full py-space-12 px-space-16 rounded-radius-button flex items-center justify-center font-medium">
              <span class="font-bold">Pay</span>
              <span class="font-italic font-bold">Pal</span>
              <span class="ml-space-8">Checkout</span>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-space-16">
          <div class="h-px bg-outline-outline-variant flex-1"></div>
          <span class="text-surface-on-surface-variant">or</span>
          <div class="h-px bg-outline-outline-variant flex-1"></div>
        </div>

        <div class="border-stroke-border-s border-outline-outline-variant rounded-radius-4">
          <div class="p-space-24 border border-outline-outline-variant">
            <h2 class="text-scale-04 font-medium text-surface-on-surface">Guest or new customer</h2>
          </div>
          <div class="p-space-24 border border-outline-outline-variant border-t-0">
            <button
              @click="$router.push('checkout/forms')"
              class="bg-brand-primary hover:bg-brand-primary-hover text-brand-on-primary mb-space-16 py-space-12 px-space-16 rounded-radius-button font-medium">
              Continue to checkout
            </button>
            <p class="text-scale-02 text-surface-on-surface-variant">
              You will be able to create a customer account during the checkout process
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column - Order Summary -->
      <div class="w-full md:w-1/2">
        <div
          class="w-full self-stretch pb-6 bg-surface-surface outline outline-1 outline-offset-[-1px] outline-outline-outline-variant inline-flex flex-col justify-start items-start gap-10">
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