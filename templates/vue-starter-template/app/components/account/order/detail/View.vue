<script setup lang="ts">
import { downloadFile } from "@shopware/helpers";
import { computed, ref } from "vue";
import type { Schemas } from "#shopware";

defineOptions({
  name: "AccountOrderDetailView",
});

const props = defineProps<{
  orderId: string;
}>();

const {
  loadOrderDetails,
  order,
  hasDocuments,
  documents,
  paymentMethod,
  paymentChangeable,
  getPaymentMethods,
  changePaymentMethod,
  shippingMethod,
  subtotal,
  total,
  shippingCosts,
  billingAddress,
  shippingAddress,
  statusTechnicalName,
  getMediaFile,
} = useOrderDetails(props.orderId);

const { pushSuccess, pushError } = useNotifications();
const { t } = useI18n();

const isLoadingOrder = ref(true);

onMounted(async () => {
  try {
    await loadOrderDetails();
  } finally {
    isLoadingOrder.value = false;
  }
});

const lineItems = computed<Array<Schemas["OrderLineItem"]>>(
  () => order.value?.lineItems || [],
);

const { browserLocale } = useShopwareContext();

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat(browserLocale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
};

const isLoading = ref(false);
const isChangePaymentModalOpen = ref(false);
const paymentMethods = ref<Schemas["PaymentMethod"][]>([]);
const loadingPaymentMethods = ref(false);

const openChangePaymentModal = async () => {
  isChangePaymentModalOpen.value = true;

  try {
    loadingPaymentMethods.value = true;
    const payments = await getPaymentMethods();
    paymentMethods.value = payments;
  } catch (error) {
    console.error(error);
  } finally {
    loadingPaymentMethods.value = false;
  }
};

const closeChangePaymentModal = () => {
  isChangePaymentModalOpen.value = false;
};

const confirmChangePaymentModal = async (paymentMethodId: string) => {
  isLoading.value = true;
  try {
    await changePaymentMethod(paymentMethodId);
    pushSuccess(t("account.messages.paymentMethodChanged"));
    closeChangePaymentModal();
  } catch (error) {
    console.error(error);
    pushError(t("messages.error"));
  } finally {
    isLoading.value = false;
  }
};

const handleDownload = async (mediaId: string, fileName: string) => {
  const response = await getMediaFile(mediaId);
  downloadFile(response, fileName);
};
</script>

<template>
  <div v-if="isLoadingOrder" class="animate-pulse">
    <div class="flex flex-col sm:flex-row justify-between mb-6">
      <div class="h-4 bg-surface-on-surface/10 rounded w-1/4" />
      <div class="h-6 bg-surface-on-surface/10 rounded w-24 mt-4 sm:mt-0" />
    </div>
    <div class="bg-surface-on-surface/10 rounded-lg h-12 mb-2" />
    <div
      v-for="i in 3"
      :key="i"
      class="flex items-center gap-4 py-4 border-b border-outline-outline-variant"
    >
      <div class="h-10 w-10 bg-surface-on-surface/10 rounded" />
      <div class="flex-1 h-4 bg-surface-on-surface/10 rounded w-2/3" />
      <div class="h-4 bg-surface-on-surface/10 rounded w-10" />
      <div class="h-4 bg-surface-on-surface/10 rounded w-16" />
      <div class="h-4 bg-surface-on-surface/10 rounded w-16" />
    </div>
    <div class="mt-8 flex flex-col sm:flex-row justify-between gap-6">
      <div class="flex-1">
        <div class="h-5 bg-surface-on-surface/10 rounded w-1/3 mb-3" />
        <div class="h-3 bg-surface-on-surface/10 rounded w-2/3 mb-2" />
        <div class="h-3 bg-surface-on-surface/10 rounded w-1/2 mb-2" />
        <div class="h-3 bg-surface-on-surface/10 rounded w-1/3" />
      </div>
      <div class="flex-1">
        <div class="h-5 bg-surface-on-surface/10 rounded w-1/3 mb-3" />
        <div class="h-3 bg-surface-on-surface/10 rounded w-2/3 mb-2" />
        <div class="h-3 bg-surface-on-surface/10 rounded w-1/2 mb-2" />
        <div class="h-3 bg-surface-on-surface/10 rounded w-1/3" />
      </div>
      <div class="w-full sm:w-1/3">
        <div class="bg-surface-on-surface/5 p-4 rounded-lg">
          <div class="h-5 bg-surface-on-surface/10 rounded w-1/2 mb-4" />
          <div class="flex justify-between mb-2">
            <div class="h-3 bg-surface-on-surface/10 rounded w-1/4" />
            <div class="h-3 bg-surface-on-surface/10 rounded w-1/5" />
          </div>
          <div class="flex justify-between mb-2">
            <div class="h-3 bg-surface-on-surface/10 rounded w-1/4" />
            <div class="h-3 bg-surface-on-surface/10 rounded w-1/5" />
          </div>
          <div
            class="border-t border-outline-outline-variant mt-2 pt-2 flex justify-between"
          >
            <div class="h-4 bg-surface-on-surface/10 rounded w-1/4" />
            <div class="h-4 bg-surface-on-surface/10 rounded w-1/5" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 bg-surface-on-surface/5 p-6 rounded-lg">
      <div class="h-5 bg-surface-on-surface/10 rounded w-1/4 mb-4" />
      <div class="h-4 bg-surface-on-surface/10 rounded w-1/3" />
    </div>
    <div class="mt-8 bg-surface-on-surface/5 p-6 rounded-lg">
      <div class="h-5 bg-surface-on-surface/10 rounded w-1/4 mb-4" />
      <div class="h-4 bg-surface-on-surface/10 rounded w-1/3" />
    </div>
  </div>

  <div v-else-if="order">
    <div class="bg-surface-surface overflow-hidden sm:rounded-lg">
      <div class="bg-surface-surface">
        <div class="flex flex-col sm:flex-row justify-between mb-6">
          <div>
            <p class="text-sm text-surface-on-surface-variant">
              {{
                $t("account.orderDetails.placedOn", {
                  d: formatDate(order.orderDate),
                })
              }}
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <AccountOrderStatus
              v-if="order.stateMachineState"
              :state="order.stateMachineState"
            />
          </div>
        </div>

        <AccountOrderDetailLineItems
          :line-items="lineItems"
          @download="handleDownload"
        />

        <AccountOrderDetailAddresses
          :shipping-address="shippingAddress"
          :billing-address="billingAddress"
        >
          <AccountOrderDetailPriceSummary
            :subtotal="subtotal"
            :shipping-costs="shippingCosts"
            :total="total"
          />
        </AccountOrderDetailAddresses>

        <AccountOrderDownloads v-if="hasDocuments" :documents="documents" />

        <AccountOrderDetailShippingMethodInfo
          v-if="shippingMethod"
          :shipping-method="shippingMethod"
        />

        <AccountOrderDetailPaymentMethodCard
          v-if="paymentMethod"
          :payment-method="paymentMethod"
          :payment-changeable="paymentChangeable"
          :status-technical-name="statusTechnicalName"
          :is-loading="isLoading"
          @change-requested="openChangePaymentModal"
        />
      </div>
    </div>

    <AccountOrderDetailChangePaymentModal
      :is-open="isChangePaymentModalOpen"
      :payment-methods="paymentMethods"
      :loading="loadingPaymentMethods"
      :current-payment-method-id="paymentMethod?.id || ''"
      @close="closeChangePaymentModal"
      @confirm="confirmChangePaymentModal"
    />
  </div>
</template>
