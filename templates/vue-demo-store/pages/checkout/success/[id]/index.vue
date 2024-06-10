<script lang="ts">
export default {
  name: "CheckoutSuccessPage",
};
</script>

<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { getTranslatedProperty } from "@shopware-pwa/helpers-next";

const { params } = useRoute();
const router = useRouter();
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
  { debounce: 5000 },
);

const isExpand = ref(false);

const toggleView = () => (isExpand.value = !isExpand.value);

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US",
  );
</script>

<template>
  <ClientOnly>
    <div
      class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-5xl lg:px-8"
    >
      <div class="space-y-1">
        <div class="text-secondary-800">
          {{ $t("checkout.success.header", [order?.orderNumber]) }}
        </div>
        <div
          v-if="isAsynchronous && paymentUrl && state?.technicalName === 'open'"
          class="mt-8 p-4 mb-8 mb-4 text-sm text-blue-700 bg-primary-100 rounded-lg dark:bg-primary-200 dark:text-blue-800"
          role="alert"
        >
          <div class="text-center w-full">
            <span class="font-medium">
              {{ $t("checkout.success.paymentProcessLabel") }}</span
            >
            {{ $t("checkout.success.paymentProcessLabel") }}
            <div>
              <button
                class="mt-4 rounded-md border border-transparent px-2 py-1 text-base font-small text-white shadow-sm bg-primary hover:bg-dark"
                @click="goToUrl(paymentUrl)"
              >
                {{ $t("checkout.goToPayment") }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="billingAddress">
        <div class="pt-8">
          <div>
            <AccountOrderSummary>
              <div class="lg:col-span-2 text-secondary-600">
                {{ order?.orderNumber }}
              </div>
              <div>
                <SharedPrice
                  v-if="order?.amountTotal"
                  :value="order.amountTotal"
                  class="text-secondary-600 font-normal"
                  data-testid="order-subtotal"
                />
              </div>
              <div v-if="order?.orderDate" class="text-secondary-600">
                {{ formatDate(order.orderDate) }}
              </div>
              <div class="text-secondary-600">
                {{ getTranslatedProperty(state, "name") }}
              </div>
              <button
                class="hidden sm:block justify-self-end text-dark cursor-pointer"
                :aria-expanded="isExpand"
                @click="toggleView"
              >
                {{ !isExpand ? "View" : "Hide" }}
              </button>
            </AccountOrderSummary>
            <div>
              <div
                class="block sm:hidden text-center text-dark cursor-pointer bg-secondary-100 py-2"
                :aria-expanded="isExpand"
                @click="toggleView"
              >
                {{ !isExpand ? "View" : "Hide" }}
              </div>
            </div>
            <template v-if="order?.id">
              <transition>
                <AccountOrderDetails v-show="isExpand" :order-id="order.id" />
              </transition>
            </template>
          </div>
        </div>
        <div class="border-t border-secondary-200 flex">
          <div class="flex-1 flex-col ml-4">
            <div
              class="flex flex-col md:flex-row gap-5 md:gap-0 md:flex-wrap py-6 md:py-10"
            >
              <div v-if="shippingAddress" class="w-auto md:w-1/2">
                <div class="font-medium">
                  {{ $t("checkout.shippingAddressLabel") }}
                </div>
                <div class="pt-2 text-secondary-600">
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
                <div class="font-medium">
                  {{ $t("checkout.billingAddressLabel") }}
                </div>
                <div class="pt-2 text-secondary-600">
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
              class="flex flex-col md:flex-row gap-5 md:gap-0 md:flex-wrap border-t border-secondary-100 md:flex py-6 md:py-10"
            >
              <div class="w-auto md:w-1/2">
                <div class="font-medium">
                  {{ $t("checkout.paymentMethodLabel") }}
                </div>
                <div class="pt-2 text-secondary-600">
                  <div>{{ paymentMethod?.translated?.name }}</div>
                </div>
              </div>
              <div v-if="shippingMethod" class="w-auto md:w-1/2">
                <div class="font-medium">
                  {{ $t("checkout.shippingMethodLabel") }}
                </div>
                <div class="pt-2 text-secondary-600">
                  <div>{{ shippingMethod?.translated?.name }}</div>
                  <div v-if="shippingMethod?.deliveryTime">
                    {{ $t("checkout.takesUpTo") }}
                    {{ shippingMethod.deliveryTime?.name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="border-t border-secondary-100 py-6 md:py-10 space-y-4">
              <div class="md:w-1/2 ml-auto flex flex-col gap-2">
                <div
                  v-if="subtotal"
                  class="flex justify-between text-base font-medium"
                >
                  <p>{{ $t("checkout.subtotal") }}</p>
                  <SharedPrice
                    :value="subtotal"
                    class="text-secondary-600 font-normal"
                    data-testid="order-subtotal"
                  />
                </div>
                <div
                  v-if="shippingCosts"
                  class="flex justify-between text-base font-medium"
                >
                  <p>{{ $t("checkout.shippingPriceLabel") }}</p>
                  <SharedPrice
                    :value="shippingCosts"
                    class="text-secondary-600 font-normal"
                    data-testid="order-shipping"
                  />
                </div>
                <div
                  v-if="total"
                  class="flex justify-between text-base font-medium"
                >
                  <p>{{ $t("checkout.totalLabel") }}</p>
                  <SharedPrice
                    :value="total"
                    class="text-secondary-600 font-normal"
                    data-testid="order-total"
                  />
                </div>
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
          <div class="text-secondary-800">
            <div
              class="h-2.5 bg-secondary-200 rounded-full dark:bg-secondary-700 w-1/2"
            />
          </div>
        </div>
        <div>
          <div class="pt-8">
            <div>
              <div
                class="h-2.5 bg-secondary-200 rounded-full dark:bg-secondary-700 px-2 py-6"
              />
              <div class="px-2 py-4">
                <div class="grid grid-cols-5 gap-y-10 pb-4 text-secondary-800">
                  <div
                    class="col-span-2 h-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-1/2"
                  />
                  <div
                    class="h-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-1/2"
                  />
                  <div
                    class="h-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-1/4"
                  />
                  <div
                    class="h-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-full"
                  />
                </div>
                <div
                  class="grid grid-cols-5 gap-y-10 gap-x-6 py-4 border-t border-secondary-200 text-secondary-400 items-center"
                >
                  <div class="flex items-center col-span-2 text-secondary-900">
                    <div
                      class="i-carbon-image bg-secondary-200 h-18 w-18 mr-2"
                    />
                    <div
                      class="h-4 ml-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-full"
                    />
                  </div>
                  <div
                    class="h-4 ml-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-1/4"
                  />
                  <div>
                    <div
                      class="flex gap-1 text-secondary-600 font-normal"
                      data-testid="order-item-unitprice"
                    >
                      <div
                        class="h-4 ml-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-1/4"
                      />
                    </div>
                  </div>
                  <div
                    class="h-4 ml-4 bg-secondary-200 rounded-full dark:bg-secondary-700 w-1/2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="border-t border-secondary-200 flex">
            <div class="flex-1 flex-col ml-4">
              <div class="md:flex md:flex-wrap py-6 md:py-10">
                <div class="w-auto md:w-1/2 w-1/2 pr-4">
                  <div
                    class="h-2.5 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48"
                  />
                </div>
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48"
                  />
                </div>
              </div>
              <div
                class="md:flex md:flex-wrap border-t border-secondary-100 md:flex py-6 md:py-10"
              >
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48"
                  />
                </div>
                <div class="w-auto md:w-1/2">
                  <div
                    class="h-2.5 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48 mb-4"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-32"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-8"
                  />
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 w-48"
                  />
                </div>
              </div>
              <div
                class="border-t border-secondary-100 py-6 md:py-10 space-y-4"
              >
                <div class="flex justify-between text-base font-medium">
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-12"
                  />
                  <div
                    class="flex gap-1 text-secondary-600 font-normal"
                    data-testid="order-subtotal"
                  >
                    <div
                      class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-16"
                    />
                  </div>
                </div>
                <!--v-if-->
                <div class="flex justify-between text-base font-medium">
                  <div
                    class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-12"
                  />
                  <div
                    class="flex gap-1 text-secondary-600y-600y-600y-600y-600y-600y-600y-600y-600y-600 font-normal"
                    data-testid="order-total"
                  >
                    <div
                      class="h-2 bg-secondary-200 rounded-full dark:bg-secondary-700 mb-2.5 w-20"
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
