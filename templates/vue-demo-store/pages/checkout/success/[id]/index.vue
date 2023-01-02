<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";
useAuthGuardRedirection();

const { params } = useRoute();
const orderId = params.id as string;

const {
  loadOrderDetails,
  shippingAddress,
  billingAddress,
  shippingMethod,
  order,
  subtotal,
  total,
  shippingCosts,
} = useOrderDetails(orderId);

const { paymentUrl, handlePayment, isAsynchronous, state, paymentMethod } =
  useOrderPayment(order);

onMounted(async () => {
  const SUCCESS_PAYMENT_URL: string = `${window?.location?.origin}/checkout/success/${orderId}/paid`;
  const FAILURE_PAYMENT_URL: string = `${window?.location?.origin}/checkout/success/${orderId}/unpaid`;

  await loadOrderDetails();
  handlePayment(SUCCESS_PAYMENT_URL, FAILURE_PAYMENT_URL);
});

const goToUrl = (url: string | null) => {
  if (typeof window !== undefined && url) {
    window.location.href = url;
  }
};

watchDebounced(
  paymentUrl,
  (paymentUrl) => {
    if (typeof paymentUrl !== "string") {
      return;
    }
    try {
      new URL(paymentUrl as string);
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("err, redirect", error);
    }
  },
  { debounce: 5000 }
);

const isExpand = ref(true);

const toggleView = () => (isExpand.value = !isExpand.value);
const format: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-us", format);
</script>

<template>
  <ClientOnly>
    <div
      class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-5xl lg:px-8"
    >
      <div class="space-y-1">
        <div class="text-gray-800">
          Your order #{{ order?.orderNumber }} has shipped and will be with you
          soon
        </div>
        <div
          v-if="isAsynchronous && paymentUrl && state?.technicalName === 'open'"
          class="mt-8 p-4 mb-8 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800"
          role="alert"
        >
          <div class="text-center w-full">
            <span class="font-medium">Finish payment process.</span> You will be
            redirected to the payment gateway in 5 seconds.
            <div>
              <button
                class="mt-4 rounded-md border border-transparent px-2 py-1 text-base font-small text-white shadow-sm bg-brand-primary hover:bg-brand-dark"
                @click="goToUrl(paymentUrl)"
              >
                Go to payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="billingAddress">
        <div class="pt-8">
          <div>
            <AccountOrderSummary>
              <div class="col-span-2">{{ order?.orderNumber }}</div>
              <div>
                <SharedPrice
                  v-if="order?.amountTotal"
                  :value="order.amountTotal"
                  class="text-gray-600 font-normal"
                  data-testid="order-subtotal"
                />
              </div>
              <div v-if="order?.orderDate">
                {{ formatDate(order.orderDate) }}
              </div>
              <div>{{ getTranslatedProperty(state, "name") }}</div>
              <button
                @click="toggleView"
                class="justify-self-end text-gray-600 px-3 text-xs font-medium text-center hover:text-white bg-gray-300 rounded-lg hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-300 dark:focus:ring-gray-400"
                :aria-expanded="isExpand"
              >
                {{ !isExpand ? "View items" : "Hide items" }}
              </button>
            </AccountOrderSummary>
            <template v-if="order?.id">
              <transition>
                <AccountOrderDetails v-if="isExpand" :orderId="order.id" />
              </transition>
            </template>
          </div>
        </div>
        <div class="border-t border-gray-200 flex">
          <div class="md:w-36"></div>
          <div class="flex-1 flex-col ml-4">
            <div class="md:flex md:flex-wrap py-6 md:py-10">
              <div class="w-auto md:w-1/2">
                <div class="font-medium">Shipping address</div>
                <div class="pt-2 text-gray-600">
                  <div>
                    {{ shippingAddress?.firstName }}
                    {{ shippingAddress?.lastName }}
                  </div>
                  <div>
                    {{ shippingAddress?.street }}
                  </div>
                  <div>
                    {{ shippingAddress?.city }}, {{ shippingAddress?.zipcode }}
                  </div>
                </div>
              </div>
              <div class="w-auto md:w-1/2">
                <div class="font-medium">Billing address</div>
                <div class="pt-2 text-gray-600">
                  <div>
                    {{ billingAddress.firstName }} {{ billingAddress.lastName }}
                  </div>
                  <div>
                    {{ billingAddress.street }}
                  </div>
                  <div>
                    {{ billingAddress.city }}, {{ billingAddress.zipcode }}
                  </div>
                </div>
              </div>
            </div>
            <div
              class="md:flex md:flex-wrap border-t border-gray-100 md:flex py-6 md:py-10"
            >
              <div class="w-auto md:w-1/2">
                <div class="font-medium">Payment method</div>
                <div class="pt-2 text-gray-600">
                  <div>{{ paymentMethod?.name }}</div>
                </div>
              </div>
              <div class="w-auto md:w-1/2">
                <div class="font-medium">Shipping method</div>
                <div class="pt-2 text-gray-600">
                  <div>{{ shippingMethod?.name }}</div>
                  <div v-if="shippingMethod?.deliveryTime">
                    Takes up to {{ shippingMethod.deliveryTime?.name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="border-t border-gray-100 py-6 md:py-10 space-y-4">
              <div
                v-if="subtotal"
                class="flex justify-between text-base font-medium"
              >
                <p>Subtotal</p>
                <SharedPrice
                  :value="subtotal"
                  class="text-gray-600 font-normal"
                  data-testid="order-subtotal"
                />
              </div>
              <div
                v-if="shippingCosts"
                class="flex justify-between text-base font-medium"
              >
                <p>Shipping</p>
                <SharedPrice
                  :value="shippingCosts"
                  class="text-gray-600 font-normal"
                  data-testid="order-shipping"
                />
              </div>
              <div
                v-if="total"
                class="flex justify-between text-base font-medium"
              >
                <p>Total</p>
                <SharedPrice
                  :value="total"
                  class="text-gray-600 font-normal"
                  data-testid="order-total"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #placeholder>
      <div
        role="status"
        class="animate-pulse max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-5xl lg:px-8"
      >
        <div class="space-y-1">
          <div class="text-gray-400">
            <div
              class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"
            ></div>
          </div>
        </div>
        <div>
          <div class="pt-8">
            <div>
              <div
                class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 px-2 py-6"
              ></div>
              <div class="px-2 py-4">
                <div class="grid grid-cols-5 gap-y-10 pb-4 text-gray-400">
                  <div
                    class="col-span-2 h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"
                  ></div>
                  <div
                    class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"
                  ></div>
                  <div
                    class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-1/4"
                  ></div>
                  <div
                    class="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
                  ></div>
                </div>
                <div
                  class="grid grid-cols-5 gap-y-10 gap-x-6 py-4 border-t border-gray-200 text-gray-400 items-center"
                >
                  <div class="flex items-center col-span-2 text-gray-900">
                    <div
                      class="i-carbon-image bg-gray-200 h-18 w-18 mr-2"
                    ></div>
                    <div
                      class="h-4 ml-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full"
                    ></div>
                  </div>
                  <div
                    class="h-4 ml-4 bg-gray-200 rounded-full dark:bg-gray-700 w-1/4"
                  ></div>
                  <div>
                    <div
                      class="flex gap-1 text-gray-600 font-normal"
                      data-testid="order-item-unitprice"
                    >
                      <div
                        class="h-4 ml-4 bg-gray-200 rounded-full dark:bg-gray-700 w-1/4"
                      ></div>
                    </div>
                  </div>
                  <div
                    class="h-4 ml-4 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-200 flex">
            <div class="md:w-36"></div>
            <div class="flex-1 flex-col ml-4">
              <div class="md:flex md:flex-wrap py-6 md:py-10">
                <div class="w-auto md:w-1/2 w-1/2 pr-4">
                  <div
                    class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48"
                  ></div>
                </div>
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48"
                  ></div>
                </div>
              </div>
              <div
                class="md:flex md:flex-wrap border-t border-gray-100 md:flex py-6 md:py-10"
              >
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48"
                  ></div>
                </div>
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  ></div>
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48"
                  ></div>
                </div>
              </div>
              <div class="border-t border-gray-100 py-6 md:py-10 space-y-4">
                <div class="flex justify-between text-base font-medium">
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-12"
                  ></div>
                  <div
                    class="flex gap-1 text-gray-600 font-normal"
                    data-testid="order-subtotal"
                  >
                    <div
                      class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-16"
                    ></div>
                  </div>
                </div>
                <!--v-if-->
                <div class="flex justify-between text-base font-medium">
                  <div
                    class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-12"
                  ></div>
                  <div
                    class="flex gap-1 text-gray-600 font-normal"
                    data-testid="order-total"
                  >
                    <div
                      class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5 w-20"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
