<script lang="ts">
export default {
  name: "CheckoutSuccessPage",
};
</script>

<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

definePageMeta({
  layout: "checkout",
});

const { params } = useRoute();
const router = useRouter();
const { refreshCart } = useCart();
const orderId = params.id as string;
const { isLoggedIn, isGuestSession } = useUser();
if (!isLoggedIn.value && !isGuestSession.value) {
  router.push("/");
}
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
  const SUCCESS_PAYMENT_URL = `${window?.location?.origin}/checkout/success/${orderId}/paid`;
  const FAILURE_PAYMENT_URL = `${window?.location?.origin}/checkout/success/${orderId}/unpaid`;

  await loadOrderDetails();
  await handlePayment(SUCCESS_PAYMENT_URL, FAILURE_PAYMENT_URL);
  await refreshCart();
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
  { debounce: 5000 },
);

const isExpand = ref(false);

const toggleView = () => (isExpand.value = !isExpand.value);

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US",
  );

const sortLineItems = computed(() => {
  return order.value?.lineItems?.sort((a: any, b: any) => a.position - b.position);
})
</script>

<template>
  <ClientOnly>
    <div class="mt-16 mb-24 max-w-[700px] mx-auto">
      <div class="flex flex-col gap-4 mb-10">
        <!-- <p class="text-sm font-medium uppercase">
          {{ $t('order_complete') }}
        </p> -->
        <h2 class="text-4xl md:text-5xl">
          {{ $t('thanks_ordering') }}
        </h2>
        <p class="text-base text-gray-500">
          {{ $t('your_order_will_with_you_soon', [order?.orderNumber]) }}
        </p>
      </div>
      <div class="mt-6 border-b border-gray-200" />
      <SharedProductOrders :line-items="sortLineItems || []" />
      <div class="mt-6 border-b border-gray-200" />
      <div class="my-6 flex justify-between text-base">
        <p>{{ $t('subtotal') }}</p>
        <SharedPrice
          :value="subtotal"
        />
      </div>
      <div class="mb-6 flex justify-between text-base">
        <p>{{ $t('shipping_estimate') }}</p>
        <SharedPrice
          :value="shippingCosts"
        />
      </div>
      <div class="border-b border-gray-200" />
      <div class="my-6 flex justify-between text-lg text-dark-primary font-medium">
        <p>{{ $t('order_total') }}</p>
        <SharedPrice :value="total" />
      </div>
      <div class="border-b border-gray-200" />
      <div class="grid grid-cols-2 my-6 md:my-10">
        <div>
          <h6 class="text-sm font-medium text-gray-900">
            {{ $t('shipping_address') }}
          </h6>
          <p class="mt-2 text-sm text-gray-500">
            {{ shippingAddress?.firstName }}{{ shippingAddress?.lastName }} <br>
            {{ shippingAddress?.street }} <br>
            {{ shippingAddress?.city }}, {{ shippingAddress?.zipcode }}
          </p>
        </div>
        <div>
          <h6 class="text-sm font-medium text-gray-900">
            {{ $t('billing_address') }}
          </h6>
          <p class="mt-2 text-sm text-gray-500">
            {{ billingAddress?.firstName }}{{ billingAddress?.lastName }} <br>
            {{ billingAddress?.street }} <br>
            {{ billingAddress?.city }}, {{ billingAddress?.zipcode }}
          </p>
        </div>
      </div>
      <div class="border-b border-gray-200" />
      <div class="grid grid-cols-2 my-6 md:my-10">
        <div>
          <h6 class="text-sm font-medium text-gray-900">
            {{ $t('payment_method') }}
          </h6>
          <p class="mt-2 text-sm text-gray-500">
            {{ (paymentMethod?.translated as any)?.name }}
          </p>
        </div>
        <div>
          <h6 class="text-sm font-medium text-gray-900">
            {{ $t('shipping_method') }}
          </h6>
          <p class="mt-2 text-sm text-gray-500">
            {{ shippingMethod?.translated?.name }} <br>
            {{ (shippingMethod?.deliveryTime as any)?.translated?.name }}
          </p>
        </div>
      </div>
      <div class="border-b border-gray-200" />
      <div class="mt-10 flex items-center justify-center">
        <RouterLink
          to="/"
          class="px-6 py-3 text-base font-medium text-white shadow-sm bg-gray-800 disabled:opacity-70"
        >
          {{ $t('continue_method') }}
        </RouterLink>
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
              class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-1/2"
            />
          </div>
        </div>
        <div>
          <div class="pt-8">
            <div>
              <div
                class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 px-2 py-6"
              />
              <div class="px-2 py-4">
                <div class="grid grid-cols-5 gap-y-10 pb-4 text-gray-400">
                  <div
                    class="col-span-2 h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-1/2"
                  />
                  <div
                    class="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-1/2"
                  />
                  <div
                    class="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4"
                  />
                  <div
                    class="h-4 bg-gray-300 rounded-full dark:bg-gray-700 w-full"
                  />
                </div>
                <div
                  class="grid grid-cols-5 gap-y-10 gap-x-6 py-4 border-t border-gray-300 text-gray-400 items-center"
                >
                  <div class="flex items-center col-span-2 text-gray-900">
                    <div class="i-carbon-image bg-gray-300 h-18 w-18 mr-2" />
                    <div
                      class="h-4 ml-4 bg-gray-300 rounded-full dark:bg-gray-700 w-full"
                    />
                  </div>
                  <div
                    class="h-4 ml-4 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4"
                  />
                  <div>
                    <div
                      class="flex gap-1 text-gray-600 font-normal"
                      data-testid="order-item-unitprice"
                    >
                      <div
                        class="h-4 ml-4 bg-gray-300 rounded-full dark:bg-gray-700 w-1/4"
                      />
                    </div>
                  </div>
                  <div
                    class="h-4 ml-4 bg-gray-300 rounded-full dark:bg-gray-700 w-1/2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-gray-300 flex">
            <div class="flex-1 flex-col ml-4">
              <div class="md:flex md:flex-wrap py-6 md:py-10">
                <div class="w-auto md:w-1/2 w-1/2 pr-4">
                  <div
                    class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-48"
                  />
                </div>
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-48"
                  />
                </div>
              </div>
              <div
                class="md:flex md:flex-wrap border-t border-gray-100 md:flex py-6 md:py-10"
              >
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-48"
                  />
                </div>
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-48"
                  />
                </div>
              </div>
              <div class="border-t border-gray-100 py-6 md:py-10 space-y-4">
                <div class="flex justify-between text-base font-medium">
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-12"
                  />
                  <div
                    class="flex gap-1 text-gray-600 font-normal"
                    data-testid="order-subtotal"
                  >
                    <div
                      class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-16"
                    />
                  </div>
                </div>
                <!--v-if-->
                <div class="flex justify-between text-base font-medium">
                  <div
                    class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-12"
                  />
                  <div
                    class="flex gap-1 text-gray-600 font-normal"
                    data-testid="order-total"
                  >
                    <div
                      class="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 w-20"
                    />
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
