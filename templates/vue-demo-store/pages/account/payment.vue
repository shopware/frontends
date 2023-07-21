<script lang="ts">
export default {
  name: "AccountPayments",
};
</script>

<script setup lang="ts">
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";

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

useBreadcrumbs([
  {
    name: "My Account",
    path: "/account",
  },
  {
    name: "Payment",
    path: "/account/payment",
  },
]);

const isLoading = ref(true);

const formData = reactive({
  paymentMethod: "",
});

const invokeSave = async (): Promise<void> => {
  try {
    isLoading.value = true;
    await setPaymentMethod({ id: formData.paymentMethod });
    await setDefaultPaymentMethod(formData.paymentMethod);
    emits("success");
    pushSuccess("Set default payment method successfully");
  } catch (error) {
    console.error("error set default payment method", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getPaymentMethods();
  formData.paymentMethod = selectedPaymentMethod?.value?.id ?? "";
  isLoading.value = false;
});
</script>

<template>
  <div class="col-span-2 mb-24">
    <div class="mb-10">
      <h3 class="mb-4">
        {{ $t("payment_methods") }}
      </h3>
      <p class="text-gray-900">
        {{ $t("view_all_available_payment_methods") }}
      </p>
    </div>
    <div v-if="isLoading" class="w-60 h-24">
      <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
        <div class="w-4 bg-gray-300 h-4 rounded-full" />
        <div class="flex flex-col space-y-3">
          <div class="w-36 bg-gray-300 h-6 rounded-md" />
          <div class="w-24 bg-gray-300 h-6 rounded-md" />
        </div>
      </div>
    </div>
    <form v-else @submit.prevent="invokeSave">
      <RadioGroup
        v-model="formData.paymentMethod"
        class="border border-gray-200 mb-6"
      >
        <RadioGroupOption
          v-for="paymentMethod in paymentMethods"
          :key="paymentMethod.id"
          :value="paymentMethod.id"
          v-slot="{ checked }"
        >
          <div
            :class="[checked ? 'bg-gray-50 text-white' : 'bg-white ']"
            class="relative flex cursor-pointer rounded-lg p-4"
          >
            <div>
              <span
                :class="[
                checked
                  ? 'bg-gray-800 border-transparent'
                  : 'bg-white border-gray-300',
                ' h-4 w-4 mr-3 mt-0.25 rounded-full border flex items-center justify-center',
              ]"
                aria-hidden="true"
              >
              <span class="rounded-full bg-white w-1.5 h-1.5" />
            </span>
            </div>
            <div>
              <RadioGroupLabel class="block cursor-pointer">
                <h6 class="block text-sm font-medium text-gray-900">{{ paymentMethod.translated?.name }}</h6>
                <p class="text-gray-700 text-sm">
                  {{ paymentMethod.translated?.description }}
                </p>
              </RadioGroupLabel>
            </div>
          </div>

          <div class="w-full border-b border-b-gray-200" />
        </RadioGroupOption>
      </RadioGroup>
      <button
        class="text-white font-medium py-2 px-5 bg-gray-800 shadow-sm disabled:opacity-50"
        type="submit"
      >
        {{ $t("change") }}
      </button>
    </form>
  </div>
</template>
