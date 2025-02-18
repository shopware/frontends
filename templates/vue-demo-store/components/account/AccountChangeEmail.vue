<script setup lang="ts">
import { customValidators } from "@/i18n/utils/i18n-validators";
import { ApiClientError, type ApiError } from "@shopware/api-client";
import { useVuelidate } from "@vuelidate/core";

const { required, minLength, email, sameAs } = customValidators();
const { user, updateEmail } = useUser();

const state = reactive({
  email: "",
  emailConfirmation: "",
  password: "",
});

const loadingData = ref(false);
const isSuccess = ref(false);
const errorMessages = ref<string[]>([]);

const rules = computed(() => ({
  email: {
    required: required,
    email: email,
  },
  emailConfirmation: {
    required: required,
    email: email,
    sameAs: sameAs(state.email),
  },
  password: {
    required: required,
    minLength: minLength(8),
  },
}));

const $v = useVuelidate(rules, state);

const invokeUpdate = async (): Promise<void> => {
  errorMessages.value = [];
  isSuccess.value = false;
  try {
    await updateEmail({
      email: state.email,
      emailConfirmation: state.emailConfirmation,
      password: state.password,
    });
    isSuccess.value = true;
  } catch (err) {
    if (err instanceof ApiClientError) {
      errorMessages.value = err.details.errors.map((m: ApiError) => m.detail);
    }
  }
};

onBeforeMount(() => {
  state.email = user.value?.email || "";
});
</script>
<template>
  <div class="space-y-8">
    <div class="text-sm text-secondary-500">
      <div>
        {{ $t("account.changeEmail.infoBox") }}
      </div>
    </div>
    <div
      v-if="isSuccess"
      class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
      role="alert"
    >
      <span class="font-medium">{{
        $t("account.messages.personalDataUpdateSuccess")
      }}</span>
    </div>
    <div
      v-if="errorMessages.length"
      class="text-red-600 focus:ring-primary border-secondary-300 rounded"
    >
      {{ errorMessages }}
    </div>
    <form
      class="mt-8 space-y-6"
      data-testid="account-personal-data-form"
      @submit.prevent="invokeUpdate"
    >
      <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
        <div>
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-secondary-500"
          >
            {{ $t("form.email") }}
          </label>
          <input
            id="email"
            v-model="state.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            :placeholder="$t('form.emailPlaceholder')"
            data-testid="account-personal-data-email-input"
            :disabled="loadingData"
            @blur="$v.email.$touch()"
          />
          <span
            v-if="$v.email.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.email.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="email-confirm"
            class="block mb-2 text-sm font-medium text-secondary-500"
          >
            {{ $t("form.confirmEmail") }}
          </label>
          <input
            id="email-confirm"
            v-model="state.emailConfirmation"
            name="email-confirm"
            type="email"
            autocomplete="email-confirm"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            :placeholder="$t('form.emailPlaceholder')"
            data-testid="account-personal-data-email-confirmation-input"
            :disabled="loadingData"
            @blur="$v.emailConfirmation.$touch()"
          />
          <span
            v-if="$v.emailConfirmation.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.emailConfirmation.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-secondary-500"
          >
            {{ $t("form.password") }}
          </label>
          <input
            id="password"
            v-model="state.password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
            data-testid="account-personal-data-password-input"
            :disabled="loadingData"
            @blur="$v.password.$touch()"
          />
          <span
            v-if="$v.password.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.password.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div>
        <button
          class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary"
          type="submit"
          data-testid="account-email-change-submit-button"
        >
          {{ $t("form.save") }}
        </button>
      </div>
    </form>
  </div>
</template>
