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
  order,
  hasDocuments,
  documents,
  paymentMethod,
  paymentChangeable,
  getPaymentMethods,
  changePaymentMethod,
  statusTechnicalName,
} = useOrderDetails(props.orderId);
const { addProducts, count } = useCart();
const addingProducts = ref(false);
const paymentMethods = ref<Schemas["PaymentMethod"][]>([]);

const lineItems = computed<Array<Schemas["OrderLineItem"]>>(
  () => order.value?.lineItems || [],
);

const selectedPaymentMethod = computed({
  get(): string | null {
    return paymentMethod.value?.id || null;
  },
  async set(paymentMethodId: string | null) {
    if (!paymentMethodId) {
      return;
    }
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

watch(
  paymentChangeable,
  async (changeable) => {
    if (!changeable || paymentMethods.value.length > 0) {
      return;
    }
    try {
      paymentMethods.value = await getPaymentMethods();
    } catch (error) {
      console.error(error);
    }
  },
  { immediate: true },
);

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
  <div>
    <div
      v-if="paymentChangeable && statusTechnicalName === 'open'"
      class="mb-8"
    >
      <h3 class="mb-4 text-surface-on-surface font-bold leading-normal">
        {{ $t("account.orderDetails.changePaymentMethod") }}
      </h3>
      <ul
        class="border border-outline-outline divide-y-1 divide-outline-outline"
      >
        <li
          v-for="singlePaymentMethod in paymentMethods"
          :key="singlePaymentMethod.id"
        >
          <label
            :for="singlePaymentMethod.id"
            class="flex items-center gap-4 p-4 cursor-pointer"
          >
            <FormRadioButton
              :id="singlePaymentMethod.id"
              v-model="selectedPaymentMethod"
              :value="singlePaymentMethod.id"
              :selected="selectedPaymentMethod === singlePaymentMethod.id"
              :disabled="isLoading"
              :data-testid="`checkout-payment-method-${singlePaymentMethod.id}`"
            />
            <div>
              <div class="text-surface-on-surface">
                {{ singlePaymentMethod.translated.name }}
              </div>
              <div
                v-if="singlePaymentMethod.translated.description"
                class="text-sm text-surface-on-surface-variant leading-[21px]"
              >
                {{ singlePaymentMethod.translated.description }}
              </div>
            </div>
          </label>
        </li>
      </ul>
    </div>
    <div v-if="lineItems.length">
      <div class="divide-y divide-outline-outline-variant">
        <AccountOrderLineItem
          v-for="lineItem in lineItems"
          :key="lineItem.identifier"
          :line-item="lineItem"
        />
      </div>
      <AccountOrderDownloads
        v-if="hasDocuments"
        :documents="documents"
        class="mt-6"
      />
      <FormBaseButton
        class="mt-8"
        variant="outline"
        data-testid="order-repeat-button"
        :label="$t('account.order.repeatOrder')"
        :loading="addingProducts"
        :disabled="addingProducts"
        @click="handleReorder"
      />
    </div>
  </div>
</template>
