<script setup lang="ts">
import { pascalCase } from "scule";
import { resolveComponent } from "vue";
import {
  getTranslatedProperty,
  getSrcSetForMedia,
} from "@shopware-pwa/helpers-next";

withDefaults(
  defineProps<{
    afterOrderRetry?: boolean;
  }>(),
  {
    afterOrderRetry: false,
  },
);

const { t } = useI18n();
const isLoading = reactive<{ [key: string]: boolean }>({});

const { selectedPaymentMethod: paymentMethod, setPaymentMethod } =
  useSessionContext();

const { getPaymentMethods, paymentMethods } = useCheckout();

onMounted(async () => {
  isLoading["paymentMethods"] = true;

  try {
    await getPaymentMethods();
  } finally {
    isLoading["paymentMethods"] = false;
  }
});

const selectedPaymentMethod = computed({
  get(): string {
    return paymentMethod.value?.id || "";
  },
  async set(paymentMethodId: string) {
    isLoading["switchingPaymentMethods"] = true;
    await setPaymentMethod({ id: paymentMethodId });
    isLoading["switchingPaymentMethods"] = false;
  },
});

const PaymentRenderer = () => {
  return paymentMethods.value
    .filter((paymentMethod) => selectedPaymentMethod.value === paymentMethod.id)
    .map((paymentMethod) => {
      const componentName = `CheckoutPayment${pascalCase(paymentMethod.shortName as string)}`;
      const component = resolveComponent(componentName);
      if (typeof component === "string") return null;

      return h(component, {
        key: paymentMethod.id,
        paymentMethod: paymentMethod,
      });
    })
    .filter((component) => component !== null);
};
</script>
<template>
  <fieldset class="grid gap-4 shadow px-4 py-5 bg-white sm:p-6">
    <legend class="pt-5">
      <h3 class="text-lg font-medium text-secondary-900 m-0">
        {{ $t("checkout.paymentMethodLabel") }}
      </h3>
      <div class="text-sm text-secondary-600">
        {{ $t("checkout.selectPaymentMethod") }}
      </div>
    </legend>

    <div v-if="isLoading['paymentMethods']" class="w-60 h-24">
      <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
        <div class="w-4 bg-gray-300 h-4 mt-1 rounded-full" />
        <div class="flex flex-col space-y-3">
          <div class="w-36 bg-gray-300 h-6 rounded-md" />
          <div class="w-24 bg-gray-300 h-6 rounded-md" />
        </div>
      </div>
    </div>
    <div
      v-for="singlePaymentMethod in paymentMethods"
      v-else
      :key="singlePaymentMethod.id"
      class="flex items-center"
    >
      <input
        :id="singlePaymentMethod.id"
        v-model="selectedPaymentMethod"
        :value="singlePaymentMethod.id"
        name="payment-method"
        type="radio"
        :disabled="
          isLoading['switchingPaymentMethods'] ||
          (afterOrderRetry && !singlePaymentMethod.afterOrderEnabled)
        "
        :class="{
          grayscale: afterOrderRetry && !singlePaymentMethod.afterOrderEnabled,
          'opacity-50 cursor-not-allowed hover:bg-brand-primary':
            afterOrderRetry && !singlePaymentMethod.afterOrderEnabled,
        }"
        :data-testid="`checkout-payment-method-${singlePaymentMethod.id}`"
        :title="
          afterOrderRetry && !singlePaymentMethod.afterOrderEnabled
            ? t('checkout.switchNotAllowed')
            : ''
        "
      />
      <label
        :for="singlePaymentMethod.id"
        :class="{
          'animate-pulse !text-gray-400': isLoading['switchingPaymentMethods'],
          grayscale: afterOrderRetry && !singlePaymentMethod.afterOrderEnabled,
          'opacity-50 cursor-not-allowed':
            afterOrderRetry && !singlePaymentMethod.afterOrderEnabled,
        }"
        class="ml-2 mt-1 block text-gray-700 w-full"
        :title="
          afterOrderRetry && !singlePaymentMethod.afterOrderEnabled
            ? t('checkout.switchNotAllowed')
            : ''
        "
      >
        <div class="flex justify-between items-center">
          <div>
            <span>
              {{ getTranslatedProperty(singlePaymentMethod, "name") }}
            </span>
            <span
              v-if="singlePaymentMethod?.description"
              class="text-sm text-gray-500 block"
            >
              {{
                getTranslatedProperty(singlePaymentMethod, "description")
              }}</span
            >
          </div>
          <div v-if="singlePaymentMethod.media?.url">
            <img
              class="md:w-20 w-15"
              loading="lazy"
              :src="singlePaymentMethod.media.url"
              :srcset="getSrcSetForMedia(singlePaymentMethod.media)"
              :alt="getTranslatedProperty(singlePaymentMethod.media, 'alt')"
            />
          </div>
        </div>
      </label>
    </div>
    <PaymentRenderer />
  </fieldset>
</template>
