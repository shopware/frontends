<script setup lang="ts">
const emits = defineEmits<{
  (e: "success"): void;
}>();

const { resetPassword, errors } = useCustomerPassword();
const { apiInstance } = useShopwareContext();
const isSuccess = ref(false);

const formData = ref({
  email: "",
  storefrontUrl: apiInstance.config.endpoint || "",
});

const recoverPasswordErrors = computed(() =>
  errors.resetPassword?.map(({ detail }) => detail).toString(),
);

const invokeRecover = async (): Promise<void> => {
  try {
    const emailSent = await resetPassword(formData.value);

    if (emailSent) {
      isSuccess.value = true;
      emits("success");
    }
  } catch (error) {
    console.error("error resend email", error);
  }
};
</script>

<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-secondary-900">
          {{ $t("recoveryPassword.header") }}
        </h2>
      </div>
      <form v-if="!isSuccess" class="space-y-6" @submit.prevent="invokeRecover">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">{{
              $t("form.email")
            }}</label>
            <input
              id="email-address"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('form.emailPlaceholder')"
            />
          </div>
        </div>

        <slot name="error">
          <div
            v-if="recoverPasswordErrors.length"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div
                class="send-email-errors text-red-600 border-secondary-300 rounded"
              >
                {{ recoverPasswordErrors }}
              </div>
            </div>
          </div>
        </slot>

        <div>
          <button
            class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-brand-light"
            type="submit"
          >
            {{ $t("recoveryPassword.form.button") }}
          </button>
        </div>
      </form>

      <p v-else class="text-center text-secondary-900">
        {{ $t("recoveryPassword.infoBox") }}
      </p>
      <slot name="action" />
    </div>
  </div>
</template>
