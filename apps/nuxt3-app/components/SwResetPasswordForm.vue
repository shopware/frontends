<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, sameAs } from "@vuelidate/validators";
import { confirmPasswordReset } from "@shopware-pwa/shopware-6-client";
import { ClientApiError } from "@shopware-pwa/types";

const { apiInstance } = useShopwareContext();

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
      await confirmPasswordReset(
        {
          newPassword: state.password.newPasswordConfirm,
          hash: hashQuery,
        },
        apiInstance
      );
    }
  } catch (err) {
    const error = err as ClientApiError;
    state.error = error.messages[0].detail;
  }
};
</script>

<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset password
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="invokeReset">
        <div
          class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          v-if="state.error"
        >
          {{ state.error }}
        </div>

        <div class="-space-y-px">
          <div>
            <label for="new-password" class="sr-only">New Password</label>
            <input
              id="new-password"
              v-model="state.password.newPassword"
              name="new-password"
              type="password"
              autocomplete="new-password"
              required
              class="appearance-none rounded-none shadow-sm relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
              placeholder="New Password"
            />
            <span
              v-if="$v.password.newPassword.$error"
              class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
            >
              {{ $v.password.newPassword.$errors[0].$message }}
            </span>
          </div>
          <div>
            <label for="confirm-password" class="sr-only"
              >Repeat Password</label
            >
            <input
              id="confirm-password"
              v-model="state.password.newPasswordConfirm"
              name="confirm-password"
              type="password"
              autocomplete="repeat-password"
              required
              class="appearance-none rounded-none shadow-sm relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
              placeholder="Repeat Password"
            />
            <span
              v-if="$v.password.newPasswordConfirm.$error"
              class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
            >
              {{ $v.password.newPasswordConfirm.$errors[0].$message }}
            </span>
          </div>
        </div>

        <div>
          <button
            class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
            type="submit"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: solid/lock-closed -->
              <svg
                class="h-5 w-5 text-brand-primary group-hover:text-brand-light"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            Set new password
          </button>
          <slot name="action" />
        </div>
      </form>
    </div>
  </div>
</template>
