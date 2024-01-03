<script lang="ts">
export default {
  name: "AccountPayments",
};
</script>

<script setup lang="ts">
definePageMeta({
  layout: "account",
});

const emits = defineEmits<{
  (e: "success"): void;
}>();

const {
  paymentMethods,
  getPaymentMethods,
  selectedPaymentMethod,
  setPaymentMethod,
} = useCheckout();
const { setDefaultPaymentMethod } = useUser();
const { pushSuccess } = useNotifications();
const { t } = useI18n();

useBreadcrumbs([
  {
    name: t("breadcrumbs.accountOverview"),
    path: "/account",
  },
  {
    name: t("breadcrumbs.payment"),
    path: "/account/payment",
  },
]);

const isLoading = ref(true);

const formData = reactive({
  paymentMethod: "",
});

const invokeSave = async (): Promise<void> => {
  try {
    await setPaymentMethod({ id: formData.paymentMethod });
    await setDefaultPaymentMethod(formData.paymentMethod);
    emits("success");
    pushSuccess(t("account.messages.paymentSetSuccessfully"));
  } catch (error) {
    console.error("error set default payment method", error);
  }
};

onMounted(async () => {
  await getPaymentMethods();
  isLoading.value = false;
});
</script>

<template>
  <div class="container mx-auto my-8">
    <fieldset class="mt-6">
      <legend class="contents text-2xl font-medium text-secondary-900">
        <h1 class="border-b pb-3">{{ $t("account.paymentMethodHeader") }}</h1>
      </legend>
      <p class="text-sm text-secondary-500 mt-3">
        {{ $t("account.selectDefaultPaymentLabel") }}:
      </p>
      <form
        class="mt-4 space-y-6"
        data-testid="account-payment"
        @submit.prevent="invokeSave"
      >
        <div v-if="isLoading" class="w-60 h-24">
          <div
            class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5"
          >
            <div class="w-4 bg-secondary-300 h-4 rounded-full" />
            <div class="flex flex-col space-y-3">
              <div class="w-36 bg-secondary-300 h-6 rounded-md" />
              <div class="w-24 bg-secondary-300 h-6 rounded-md" />
            </div>
          </div>
        </div>
        <div v-else class="mt-4 space-y-4">
          <div
            v-for="paymentMethod in paymentMethods"
            :key="paymentMethod.id"
            class="flex items-center"
          >
            <input
              :id="paymentMethod.id"
              v-model="formData.paymentMethod"
              :value="paymentMethod.id"
              :checked="selectedPaymentMethod?.id === paymentMethod.id"
              name="payment-method"
              type="radio"
              class="focus:ring-brand-light h-4 w-4 text-primary border-secondary-300"
              data-testid="account-payment-checkbox"
            />
            <label
              :for="paymentMethod.id"
              class="ml-3 block text-sm font-medium text-secondary-700"
            >
              {{ paymentMethod.translated?.name }}
            </label>
          </div>
          <button
            class="group relative justify-center py-2 px-4 my-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
            type="submit"
            data-testid="account-payment-submit-button"
          >
            {{ $t("account.save") }}
          </button>
        </div>
      </form>
    </fieldset>
  </div>
</template>
