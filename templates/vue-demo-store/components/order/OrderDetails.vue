<script lang="ts" setup>
import type { Schemas } from "#shopware";

const props = defineProps<{
  order: Schemas["Order"];
}>();

// Change inside computed
const { paymentUrl, handlePayment, isAsynchronous, state, paymentMethod } =
  useOrderPayment(computed(() => props.order));

const goToUrl = (url: string | null) => {
  if (typeof window !== "undefined" && url) {
    window.location.href = url;
  }
};
const billingAddress = computed(() =>
  props.order?.addresses?.find(
    ({ id }: { id: string }) => id === props.order.billingAddressId,
  ),
);

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString(
    (typeof navigator !== "undefined" && navigator.language) || "en-US",
  );

const isExpand = ref(false);

const toggleView = () => isExpand.value = !isExpand.value;

const shippingAddress = computed(
  () => props.order.deliveries?.[0]?.shippingOrderAddress,
);
</script>
<template>
  <div class="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-6 lg:max-w-5xl lg:px-8">
    <div class="space-y-1">
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

    <div>
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
            <!-- <div class="text-secondary-600">
              {{ status }}
            </div> -->
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
          <template v-if="order?.id && isExpand">
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
            <!-- <div class="w-auto md:w-1/2">
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
            </div> -->
          </div>
          <div
            class="flex flex-col md:flex-row gap-5 md:gap-0 md:flex-wrap border-t border-secondary-100 md:flex py-6 md:py-10"
          >
            <div class="w-auto md:w-1/2">
              <div class="font-medium">
                {{ $t("checkout.paymentMethodLabel") }}
              </div>
              <div class="pt-2 text-secondary-600">
                <div>{{ paymentMethod?.translated.name }}</div>
              </div>
            </div>
            <!-- <div v-if="shippingMethod" class="w-auto md:w-1/2">
              <div class="font-medium">
                {{ $t("checkout.shippingMethodLabel") }}
              </div>
              <div class="pt-2 text-secondary-600">
                <div>{{ shippingMethod?.translated.name }}</div>
                <div v-if="shippingMethod?.deliveryTime">
                  {{ $t("checkout.takesUpTo") }}
                  {{ shippingMethod.deliveryTime?.name }}
                </div>
              </div>
            </div> -->
          </div>
          <!-- <div class="border-t border-secondary-100 py-6 md:py-10 space-y-4">
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
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
