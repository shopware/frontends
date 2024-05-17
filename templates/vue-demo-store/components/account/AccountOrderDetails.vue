<script setup lang="ts">
import type { Schemas } from "#shopware";

const props = defineProps<{
  orderId: string;
}>();
const isLoading = ref(false);
const { pushSuccess, pushError } = useNotifications();
const { t } = useI18n();
const {
  loadOrderDetails,
  order,
  hasDocuments,
  documents,
  paymentMethod,
  paymentChangeable,
  getPaymentMethods,
  changePaymentMethod,
  statusTechnicalName,
} = await useOrderDetails(props.orderId);

onMounted(() => {
  loadOrderDetails();
});

const lineItems = computed<Array<Schemas["OrderLineItem"]>>(
  () => order.value?.lineItems || [],
);

const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    isLoading.value = true;
    try {
      await changePaymentMethod(paymentMethodId);
      pushSuccess(t("account.messages.paymentMethodChanged"));
    } catch (error) {
      console.error(error);
      pushError(t("messages.error"));
    } finally {
      isLoading.value = false;
    }
  },
});
const paymentMethods = await getPaymentMethods();
</script>

<script lang="ts">
export default {
  name: "AccountOrderDetails",
};
</script>

<template>
  <div
    v-if="paymentChangeable && statusTechnicalName === 'open'"
    class="px-2 py-4"
  >
    <h3 class="mb-5 text-secondary-400 text-base">
      {{ $t("account.order.paymentMethod") }}
    </h3>
    <ul class="pl-2">
      <li
        v-for="singlePaymentMethod in paymentMethods"
        :key="singlePaymentMethod.id"
        class="flex mb-3"
      >
        <input
          :id="singlePaymentMethod.id"
          v-model="selectedPaymentMethod"
          :value="singlePaymentMethod.id"
          name="payment-method"
          type="radio"
          class="focus:ring-primary h-4 w-4 border-secondary-300"
          :data-testid="`checkout-payment-method-${singlePaymentMethod.id}`"
          :checked="selectedPaymentMethod === singlePaymentMethod.id"
          :disabled="isLoading"
        />
        <label
          :for="singlePaymentMethod.id"
          class="ml-2 block text-sm font-medium text-secondary-700 w-full"
        >
          <div class="flex justify-between">
            <div>
              <span>
                {{ singlePaymentMethod.translated?.name }}
              </span>
              <span
                v-if="singlePaymentMethod.translated?.description"
                class="italic text-sm text-secondary-500 block"
              >
                {{ singlePaymentMethod.translated.description }}</span
              >
            </div>
          </div>
        </label>
      </li>
    </ul>
  </div>
  <div v-if="lineItems.length" class="px-2 py-4">
    <div
      class="hidden sm:grid grid-cols-5 gap-y-10 gap-x-6 pb-4 text-secondary-400"
    >
      <div class="col-span-2">{{ $t("account.order.product") }}</div>
      <div>{{ $t("account.order.quantity") }}</div>
      <div>{{ $t("account.order.price") }}</div>
      <div class="justify-self-end">
        {{ $t("account.order.subtotal") }}
      </div>
    </div>

    <AccountOrderLineItem
      v-for="lineItem in lineItems"
      :key="lineItem.identifier"
      :line-item="lineItem"
    />
    <AccountOrderDownloads v-if="hasDocuments" :documents="documents" />
  </div>
</template>
