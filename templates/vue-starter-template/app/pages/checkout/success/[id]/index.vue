<script setup lang="ts">
import { getShippingMethodDeliveryTime } from "@shopware/helpers";
import { watchDebounced } from "@vueuse/core";

defineOptions({
  name: "CheckoutSuccessPage",
});

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
  if (typeof window !== "undefined" && url) {
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
      new URL(paymentUrl);
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("err, redirect", error);
    }
  },
  { debounce: 5000 },
);

const { browserLocale } = useShopwareContext();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { t } = useI18n();

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(browserLocale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));

const shippingDeliveryTime = computed(() => {
  if (!shippingMethod.value?.deliveryTime) {
    return undefined;
  }
  return `${t("checkout.takesUpTo")} ${getShippingMethodDeliveryTime(shippingMethod.value)}`;
});

const orderDetailsLink = computed(() => {
  if (!isLoggedIn.value || !order.value?.id) {
    return null;
  }
  return formatLink(`/account/order/details/${order.value.id}`);
});

const showPaymentAlert = computed(
  () =>
    Boolean(isAsynchronous.value) &&
    Boolean(paymentUrl.value) &&
    state.value?.technicalName === "open",
);
</script>

<template>
  <ClientOnly>
    <CheckoutSuccessSkeleton v-if="!order" />
    <div
      v-else
      class="container mx-auto px-6 sm:px-4 py-10 md:py-20"
      data-testid="checkout-success-page"
    >
      <header class="flex items-start gap-4 md:gap-6 mb-10 md:mb-16">
        <div
          class="flex items-center justify-center w-12.5 h-12.5 rounded-full bg-brand-secondary text-brand-on-secondary shrink-0"
          aria-hidden="true"
        >
          <div class="w-6 h-6 i-carbon-checkmark" />
        </div>
        <div class="min-w-0">
          <h1
            class="text-10 font-['Noto_Serif'] text-surface-on-surface leading-15"
          >
            {{ $t("checkout.success.title") }}
          </h1>
          <p class="text-surface-on-surface mt-2 max-w-2xl leading-normal">
            {{ $t("checkout.success.header", [order.orderNumber]) }}
          </p>
          <div class="flex flex-wrap items-center gap-3 mt-4">
            <span
              v-if="order.orderNumber"
              class="text-sm text-surface-on-surface-variant"
            >
              {{ $t("account.order.orderNumber") }}
              <span class="text-surface-on-surface font-medium">{{
                order.orderNumber
              }}</span>
            </span>
            <AccountOrderStatus
              v-if="order.stateMachineState"
              :state="order.stateMachineState"
            />
            <span
              v-if="order.orderDate"
              class="text-sm text-surface-on-surface-variant"
            >
              {{ formatDate(order.orderDate) }}
            </span>
          </div>
        </div>
      </header>

      <div
        v-if="showPaymentAlert"
        class="mb-10 p-4 text-sm text-states-on-info-container bg-states-info-container"
        role="alert"
      >
        <div class="font-medium">
          {{ $t("checkout.success.paymentProcessLabel") }}
        </div>
        <p class="mt-1">
          {{ $t("checkout.success.paymentProcessInfo") }}
        </p>
        <FormBaseButton
          class="mt-4"
          :label="$t('checkout.success.goToPayment')"
          @click="goToUrl(paymentUrl)"
        />
      </div>

      <div class="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between">
        <div class="w-full lg:w-1/2 flex flex-col gap-10 order-2 lg:order-1">
          <section>
            <AccountSectionHeader
              class="mb-4"
              :title="$t('checkout.success.items')"
            />
            <AccountOrderDetails :order-id="order.id" />
          </section>

          <section>
            <AccountSectionHeader
              class="mb-6"
              :title="$t('checkout.success.deliveryAndPayment')"
            />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CheckoutOrderAddress
                v-if="shippingAddress"
                :address="shippingAddress"
                :label="$t('checkout.shippingAddressLabel')"
              />
              <CheckoutOrderAddress
                v-if="billingAddress"
                :address="billingAddress"
                :label="$t('checkout.billingAddressLabel')"
              />
              <CheckoutOrderMethodCard
                :label="$t('checkout.paymentMethodLabel')"
                :title="paymentMethod?.translated.name"
              />
              <CheckoutOrderMethodCard
                v-if="shippingMethod"
                :label="$t('checkout.shippingMethodLabel')"
                :title="shippingMethod.translated.name"
                :description="shippingDeliveryTime"
              />
            </div>
          </section>
        </div>

        <aside class="w-full lg:w-1/2 order-1 lg:order-2">
          <div class="border border-outline-outline sticky top-2">
            <div class="border-b border-outline-outline-variant">
              <h2 class="text-10 px-6 font-['Noto_Serif']">
                {{ $t("checkout.summary") }}
              </h2>
            </div>
            <div class="p-6">
              <div
                class="py-4 border-b border-outline-outline-variant flex flex-col gap-1"
              >
                <div class="flex justify-between text-sm leading-normal">
                  <span class="text-surface-on-surface-variant">{{
                    $t("checkout.subtotal")
                  }}</span>
                  <SharedPrice
                    :value="subtotal"
                    class="text-surface-on-surface font-normal"
                    data-testid="order-subtotal"
                  />
                </div>
                <div class="flex justify-between text-sm leading-normal">
                  <span class="text-surface-on-surface-variant">{{
                    $t("checkout.shippingPriceLabel")
                  }}</span>
                  <SharedPrice
                    :value="shippingCosts"
                    class="text-surface-on-surface font-normal"
                    data-testid="order-shipping"
                  />
                </div>
              </div>
              <div class="pt-4 flex justify-between">
                <span
                  class="text-surface-on-surface text-base leading-normal"
                  >{{ $t("checkout.totalLabel") }}</span
                >
                <SharedPrice
                  :value="total"
                  class="text-surface-on-surface text-base leading-normal"
                  data-testid="order-total"
                />
              </div>

              <div class="mt-8 flex flex-col gap-3">
                <NuxtLink
                  :to="formatLink('/')"
                  class="bg-brand-primary text-brand-on-primary text-center font-bold leading-6 py-3 px-4 rounded inline-flex justify-center items-center"
                >
                  {{ $t("checkout.success.continueShopping") }}
                </NuxtLink>
                <NuxtLink
                  v-if="orderDetailsLink"
                  :to="orderDetailsLink"
                  class="border-1 border-brand-primary text-brand-primary text-center font-bold leading-6 py-3 px-4 rounded inline-flex justify-center items-center"
                >
                  {{ $t("checkout.success.viewInAccount") }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    <template #placeholder>
      <CheckoutSuccessSkeleton />
    </template>
  </ClientOnly>
</template>
