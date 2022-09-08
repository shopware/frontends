<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, sameAs } from "@vuelidate/validators";

const emits = defineEmits<{
  (e: "success"): void;
}>();

const { updatePassword, errors } = useCustomerPassword();
const { user, refreshUser } = useUser();

const userErrorMessages = computed(() =>
  errors.updatePassword?.map(({ detail }) => detail).toString()
);

const isSuccess = ref(false);

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
      <span class="font-medium">Your password has been updated.</span>
    </div>
    <div class="text-sm text-gray-500">
      <div>
        If you want to change the password to access your account, enter the following
        information:
      </div>
      <div v-if="state.email">
        Your current email address is
        <span class="text-gray-900">{{ state.email }}</span>
      </div>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="invokeChange">
      <div
        class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
        v-if="userErrorMessages.length"
      >
        {{ userErrorMessages }}
      </div>

      <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
        <div>
          <label
            for="current-password"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
            >Curent password</label
          >
          <input
            id="current-password"
            v-model="state.password.currentPassword"
            name="curent-password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
          />
          <span
            v-if="$v.password.currentPassword.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.password.currentPassword.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="new-password"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
            >New password</label
          >
          <input
            id="new-password"
            v-model="state.password.newPassword"
            name="new-password"
            type="password"
            autocomplete="new-password"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
          />
          <span
            v-if="$v.password.newPassword.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.password.newPassword.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="confirm-password"
            class="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
            >Repeat password</label
          >
          <input
            id="confirm-password"
            v-model="state.password.newPasswordConfirm"
            name="confirm-password"
            type="password"
            autocomplete="repeat-password"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
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
          Change password
        </button>
      </div>
    </form>
  </div>
</template>
