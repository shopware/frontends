<script setup lang="ts">
import {
  XMarkIcon
} from '@heroicons/vue/24/outline';
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue';
const isOpen = inject<boolean>("isSidebarOpen");

const { cartItems, count, subtotal, shippingTotal, totalPrice, isEmpty } = useCart();

const close = () => {
  (isOpen as any).value = false;
}
</script>

<template>
  <TransitionRoot
    :show="isOpen"
    appear
    as="template"
  >
    <Dialog
      as="div"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-in-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-300 ease-out"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-10 bg-gray-500 bg-opacity-60" />
      </TransitionChild>
      <TransitionChild
        as="template"
        enter="duration-300 ease-in-out"
        enter-from="translate-x-full"
        enter-to="translate-x-0"
        leave="duration-300 ease-out"
        leave-from="translate-x-0"
        leave-to="translate-x-full"
      >
        <DialogPanel class="w-full flex flex-col fixed inset-y-0 right-0 z-50 overflow-y-auto bg-white sm:max-w-[448px] sm:ring-1 sm:ring-gray-900/10">
          <div class="w-full pointer-events-auto h-full">
            <div class="flex h-full w-full flex-col bg-white shadow-xl py-6 px-4 sm:p-6">
              <div class="flex flex-col h-full">
                <div class="flex items-start justify-between">
                  <h2
                    id="slide-over-title"
                    class="text-lg font-medium text-gray-900 py-0"
                  >
                    {{ $t('shopping_bag') }} ({{count}})
                  </h2>
                  <div class="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      class="-m-2 p-2 text-gray-700"
                      @click="isOpen = false"
                    >
                      <span class="sr-only">Close panel</span>
                      <XMarkIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div v-if="isEmpty" class="flex-1 min-h-0 text-center flex flex-col justify-center">
                  <h4 class="mb-2 font-medium text-2xl text-dark-primary">{{$t('your_cart_empty')}}</h4>
                  <p class="mb-6 text-base text-gray-500">{{$t('your_cart_empty_desc')}}</p>
                  <nuxt-link to="/" @click="close" class="bg-gray-100 shadow-sm px-6 py-3 text-base font-medium">{{ $t('start_shopping') }}</nuxt-link>
                </div>

                <div v-else class="flex flex-col flex-1 min-h-0 gap-4 sm:gap-6 mt-6">
                  <div class="flex-1 min-h-0 overflow-y-auto -mr-6">
                    <SharedProductOrders class="flex-1 -mt-6 pr-6" :isMiniCart="true" :enableActions="true" :lineItems="cartItems || []" />
                  </div>
                  <div class="flex flex-col mt-auto">
                    <div class="flex flex-col gap-2">
                      <div class="flex justify-between text-base text-gray-500">
                        <p>{{ $t('subtotal') }}</p>
                        <SharedPrice
                          :value="subtotal"
                          data-testid="cart-subtotal"
                        />
                      </div>
                      <div class="flex justify-between text-base text-gray-500">
                        <p>{{ $t('shipping_estimate') }}</p>
                        <SharedPrice
                          :value="shippingTotal"
                          data-testid="cart-subtotal"
                        />
                      </div>
                      <div class="flex justify-between text-lg text-gray-900 font-medium">
                        <p>{{ $t('order_total') }}</p>
                        <SharedPrice :value="totalPrice" data-testid="cart-subtotal" />
                      </div>
                    </div>
                    <div class="flex flex-col">
                      <nuxt-link
                        class="mt-3 flex text-white items-center justify-center px-5 py-3 text-base font-medium text-white shadow-sm bg-gray-800"
                        :to="'/checkout'"
                        @click="close"
                      >
                        {{ $t('go_to_checkout') }}
                      </nuxt-link>
                      <nuxt-link
                        class="font-medium text-gray-900 mt-6 text-center underline underline-offset-4"
                        @click="close"
                        :to="'/checkout/cart'">
                        {{ $t('show_shopping_cart') }}
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
