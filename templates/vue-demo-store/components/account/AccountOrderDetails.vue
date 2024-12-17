<script setup lang="ts">
import type { Schemas, operations } from "#shopware";

defineOptions({
  name: "AccountOrderDetails",
});

const props = defineProps<{
  orderId: string;
}>();
const isLoading = ref(false);
const { getErrorsCodes } = useCartNotification();
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
const { addProducts, count } = useCart();
const addingProducts = ref(false);
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

const handleReorder = async () => {
  if (!order.value?.lineItems) {
    return;
  }
  const items = order.value?.lineItems?.reduce(
    (acc, lineItem) => {
      if (lineItem.type !== "product" || lineItem.good === false) {
        return acc;
      }

      acc.push({
        id: lineItem.productId || lineItem.identifier,
        quantity: lineItem.quantity,
        type: "product",
      });

      return acc;
    },
    [] as operations["addLineItem post /checkout/cart/line-item"]["body"]["items"],
  );

  try {
    addingProducts.value = true;
    const itemsBefore = count.value;
    await addProducts(items);

    for (const element of getErrorsCodes() ?? []) {
      pushError(t(`errors.${element.messageKey}`, { ...element }));
    }

    if (itemsBefore < count.value) {
      pushSuccess(t("account.messages.productsAdded"));
    }
  } catch (error) {
    console.error(error);
    pushError(t("messages.error"));
  } finally {
    addingProducts.value = false;
  }
};
</script>

<template>
  <div
    v-if="paymentChangeable && statusTechnicalName === 'open'"
    class="px-2 py-4"
  >
    <h3 class="mb-5 text-secondary-600 text-base">
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
                {{ singlePaymentMethod.translated.name }}
              </span>
              <span
                v-if="singlePaymentMethod.translated.description"
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
      class="hidden sm:grid grid-cols-5 gap-y-10 gap-x-6 pb-4 text-secondary-600"
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
    <button
      class="mt-10 p-3"
      data-testid="order-repeat-button"
      :disabled="addingProducts"
      @click="handleReorder"
    >
      {{ $t("account.order.repeatOrder") }}
    </button>
  </div>
</template>
