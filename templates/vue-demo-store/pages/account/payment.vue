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

const { paymentMethods, getPaymentMethods } = useCheckout();
const { setDefaultPaymentMethod } = useUser();
const { paymentMethod, setPaymentMethod } = useSessionContext();
const { pushSuccess } = useNotifications();

const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  await getPaymentMethods();
  isLoading.value = false;
});

const formData = ref({
  paymentMethod: paymentMethod.value?.id || "",
});

const invokeSave = async (): Promise<void> => {
  try {
    await setPaymentMethod({ id: formData.value.paymentMethod });
    await setDefaultPaymentMethod(formData.value.paymentMethod);
    emits("success");
    pushSuccess("Set default payment method successfully");
  } catch (error) {
    console.error("error set default payment method", error);
  }
};
</script>

<template>
  <div class="container mx-auto my-8">
    <fieldset class="mt-6">
      <legend class="contents text-2xl font-medium text-gray-900">
        <h1 class="border-b pb-3">Payment method</h1>
      </legend>
      <p class="text-sm text-gray-500 mt-3">Select your default payment method:</p>
      <form class="mt-4 space-y-6" @submit.prevent="invokeSave">
        <div v-if="isLoading" class="w-60 h-24">
          <div class="flex animate-pulse flex-row items-top pt-4 h-full space-x-5">
            <div class="w-4 bg-gray-300 h-4 rounded-full" />
            <div class="flex flex-col space-y-3">
              <div class="w-36 bg-gray-300 h-6 rounded-md" />
              <div class="w-24 bg-gray-300 h-6 rounded-md" />
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
              name="payment-method"
              type="radio"
              class="focus:ring-brand-light h-4 w-4 text-brand-primary border-gray-300"
            />
            <label
              :for="paymentMethod.id"
              class="ml-3 block text-sm font-medium text-gray-700"
            >
              {{ paymentMethod.name }}
            </label>
          </div>
          <button
            class="group relative justify-center py-2 px-4 my-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </fieldset>
  </div>
</template>
