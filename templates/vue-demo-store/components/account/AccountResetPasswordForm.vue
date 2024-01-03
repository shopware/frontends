<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { customValidators } from "@/i18n/utils/i18n-validators";
import { ApiClientError } from "@shopware/api-client";

const { required, minLength, sameAs } = customValidators();
const { apiClient } = useShopwareContext();

const state = reactive({
  password: {
    newPassword: "",
    newPasswordConfirm: "",
  },
  error: "",
});

const rules = computed(() => ({
  password: {
    newPassword: {
      required,
      minLength: minLength(8),
    },
    newPasswordConfirm: {
      required,
      newPasswordConfirm: sameAs(state.password.newPassword),
    },
  },
}));

const $v = useVuelidate(rules, state);

const invokeReset = async (): Promise<void> => {
  const route = useRoute();
  const hashQuery = route.query.hash?.toString() || "";

  try {
    const isFormCorrect = await $v.value.$validate();

    if (!isFormCorrect) {
      return;
    } else {
      await apiClient.invoke(
        "recoveryPassword post /account/recovery-password-confirm",
        {
          hash: hashQuery,
          newPassword: state.password.newPasswordConfirm,
          newPasswordConfirm: state.password.newPasswordConfirm,
        },
      );
    }
  } catch (err) {
    if (err instanceof ApiClientError) {
      state.error = err.details.errors?.[0]?.detail;
    }
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
          {{ $t("resetPassword.header") }}
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="invokeReset">
        <div
          v-if="state.error"
          class="text-red-600 focus:ring-primary border-secondary-300 rounded"
        >
          {{ state.error }}
        </div>

        <div class="-space-y-px">
          <div>
            <label for="new-password" class="sr-only">{{
              $t("resetPassword.form.newPassword")
            }}</label>
            <input
              id="new-password"
              v-model="state.password.newPassword"
              name="new-password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none shadow-sm relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('form.newPasswordPlaceholder')"
            />
            <span
              v-if="$v.password.newPassword.$error"
              class="text-red-600 focus:ring-primary border-secondary-300 rounded"
            >
              {{ $v.password.newPassword.$errors[0].$message }}
            </span>
          </div>
          <div>
            <label for="confirm-password" class="sr-only">{{
              $t("resetPassword.form.repeatPassword")
            }}</label>
            <input
              id="confirm-password"
              v-model="state.password.newPasswordConfirm"
              name="confirm-password"
              type="password"
              autocomplete="off"
              required
              class="appearance-none rounded-none shadow-sm relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('form.repeatPasswordPlaceholder')"
            />
            <span
              v-if="$v.password.newPasswordConfirm.$error"
              class="text-red-600 focus:ring-primary border-secondary-300 rounded"
            >
              {{ $v.password.newPasswordConfirm.$errors[0].$message }}
            </span>
          </div>
        </div>

        <div>
          <button
            class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
            type="submit"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="w-5 h-5 i-carbon-locked" />
            </span>
            {{ $t("resetPassword.form.button") }}
          </button>
          <slot name="action" />
        </div>
      </form>
    </div>
  </div>
</template>
