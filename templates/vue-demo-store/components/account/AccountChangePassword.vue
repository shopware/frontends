<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { customValidators } from "@/i18n/utils/i18n-validators";

const { required, minLength, sameAs } = customValidators();
const emits = defineEmits<{
  (e: "success"): void;
}>();

const { updatePassword, errors } = useCustomerPassword();
const { user, refreshUser } = useUser();

const userErrorMessages = computed(() =>
  errors.updatePassword?.map(({ detail }) => detail).toString(),
);

const isSuccess = ref(false);
const loadingData = ref(false);

const state = reactive({
  password: {
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  },
  email: user.value?.email,
});

const rules = computed(() => ({
  password: {
    currentPassword: {
      required,
      minLength: minLength(8),
    },
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

const invokeChange = async (): Promise<void> => {
  loadingData.value = true;
  try {
    const isFormCorrect = await $v.value.$validate();

    if (isFormCorrect) {
      const changePasswordResult = await updatePassword({
        password: state.password.currentPassword,
        newPassword: state.password.newPassword,
        newPasswordConfirm: state.password.newPasswordConfirm,
      });
      await refreshUser();

      if (changePasswordResult) {
        state.password.currentPassword = "";
        state.password.newPassword = "";
        state.password.newPasswordConfirm = "";

        $v.value.$reset();

        isSuccess.value = true;
        emits("success");
      }
    } else {
      return;
    }
  } catch (err) {
    console.error("error change password", err);
  } finally {
    loadingData.value = false;
  }
};
</script>
<template>
  <div class="space-y-8">
    <div
      v-if="isSuccess"
      class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
      role="alert"
    >
      <span class="font-medium">{{
        $t("changePassword.messages.passwordUpdateSuccess")
      }}</span>
    </div>
    <div class="text-sm text-secondary-500">
      <div>
        {{ $t("changePassword.infoBox") }}
      </div>
      <div v-if="state.email">
        {{ $t("changePassword.currentEmail") }}
        <span class="text-secondary-900">{{ state.email }}</span>
      </div>
    </div>
    <form
      class="mt-8 space-y-6"
      data-testid="account-change-password-form"
      @submit.prevent="invokeChange"
    >
      <div
        v-if="userErrorMessages.length"
        class="text-red-600 focus:ring-primary border-secondary-300 rounded"
      >
        {{ userErrorMessages }}
      </div>

      <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
        <div>
          <label
            for="current-password"
            class="block mb-2 text-sm font-medium text-secondary-500 dark:text-white"
            >{{ $t("changePassword.form.currentPassword") }}</label
          >
          <input
            id="current-password"
            v-model="state.password.currentPassword"
            name="curent-password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
            data-testid="account-change-current-password-input"
            :disabled="loadingData"
          />
          <span
            v-if="$v.password.currentPassword.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.password.currentPassword.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="new-password"
            class="block mb-2 text-sm font-medium text-secondary-500 dark:text-white"
            >{{ $t("changePassword.form.newPassword") }}</label
          >
          <input
            id="new-password"
            v-model="state.password.newPassword"
            name="new-password"
            type="password"
            autocomplete="new-password"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
            data-testid="account-change-new-password-input"
            :disabled="loadingData"
          />
          <span
            v-if="$v.password.newPassword.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.password.newPassword.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="confirm-password"
            class="block mb-2 text-sm font-medium text-secondary-500 dark:text-white"
            >{{ $t("changePassword.form.resetPassword") }}</label
          >
          <input
            id="confirm-password"
            v-model="state.password.newPasswordConfirm"
            name="confirm-password"
            type="password"
            autocomplete="off"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
            data-testid="account-change-confirm-password-input"
            :disabled="loadingData"
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
          data-testid="account-change-current-submit-button"
        >
          {{ $t("changePassword.form.changePassword") }}
        </button>
      </div>
    </form>
  </div>
</template>
