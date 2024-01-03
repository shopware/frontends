<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { customValidators } from "@/i18n/utils/i18n-validators";
import { ApiClientError, type ApiError } from "@shopware/api-client";
const { required, minLength, requiredIf, email, sameAs } = customValidators();

const { user, refreshUser, updatePersonalInfo, updateEmail } = useUser();

const errorMessages = ref<string[]>([]);

const isSuccess = ref(false);
const updated = ref(false);
const isUpdating = ref(false);
const loadingData = ref(false);

const state = reactive({
  firstName: "",
  lastName: "",
  email: "",
  emailConfirmation: "",
  password: "",
  salutationId: "",
  title: "",
});

const isEmailChanging = computed(() => state.email !== user.value?.email);

const isNameChanging = computed(
  () =>
    state.firstName !== user.value?.firstName ||
    state.lastName !== user.value?.lastName,
);

const refs = toRefs(state);

const emailConfirmationValidationRule = computed(() =>
  isEmailChanging.value
    ? {
        required,
        email,
        sameAsEmail: sameAs(refs.email),
      }
    : {},
);

const rules = computed(() => ({
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  email: {
    email,
    required,
  },
  emailConfirmation: emailConfirmationValidationRule.value, // take a dynamic one
  password: {
    required: requiredIf(() => {
      return isEmailChanging.value;
    }),
    minLength: minLength(8),
  },
}));

const $v = useVuelidate(rules, state);

const invokeUpdate = async (): Promise<void> => {
  errorMessages.value = [];
  isSuccess.value = false;
  try {
    loadingData.value = true;
    updated.value = false;
    $v.value.$touch();
    if (
      $v.value.$invalid ||
      (!isNameChanging.value && !isEmailChanging.value)
    ) {
      return;
    }
    isUpdating.value = true;

    if (isNameChanging.value) {
      await updatePersonalInfo({
        firstName: state.firstName,
        lastName: state.lastName,
        salutationId: state.salutationId,
        title: state.title,
      });
      isSuccess.value = true;
    }

    if (isEmailChanging.value) {
      await updateEmail({
        email: state.email,
        emailConfirmation: state.emailConfirmation,
        password: state.password,
      });
      isSuccess.value = true;
    }

    isUpdating.value = false;

    refreshUser();
  } catch (err) {
    if (err instanceof ApiClientError) {
      errorMessages.value = err.details.errors.map((m: ApiError) => m.detail);
    }
  } finally {
    loadingData.value = false;
  }
};
onBeforeMount(async () => {
  loadingData.value = true;
  await refreshUser();
  state.firstName = user.value?.firstName || "";
  state.lastName = user.value?.lastName || "";
  state.email = user.value?.email || "";
  state.salutationId = user.value?.salutationId || "";
  state.title = user.value?.title || "";
  loadingData.value = false;
});
</script>
<template>
  <div class="space-y-8">
    <div class="text-sm text-secondary-500">
      <div>
        {{ $t("account.personalData.infoBox") }}
      </div>
    </div>
    <form
      class="mt-8 space-y-6"
      data-testid="account-personal-data-form"
      @submit.prevent="invokeUpdate"
    >
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
      <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
        <div>
          <label
            for="firstname"
            class="block mb-2 text-sm font-medium text-secondary-500"
          >
            {{ $t("form.firstName") }}
          </label>
          <input
            id="firstname"
            v-model="state.firstName"
            name="firstname"
            type="text"
            autocomplete="on"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            :placeholder="$t('form.firstNamePlaceholder')"
            data-testid="account-personal-data-firstname-input"
            :disabled="loadingData"
            @blur="$v.firstName.$touch()"
          />
          <span
            v-if="$v.firstName.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.firstName.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="lastname"
            class="block mb-2 text-sm font-medium text-secondary-500"
          >
            {{ $t("form.lastName") }}
          </label>
          <input
            id="lastname"
            v-model="state.lastName"
            name="lastname"
            type="text"
            autocomplete="on"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            :placeholder="$t('form.lastNamePlaceholder')"
            data-testid="account-personal-data-lastname-input"
            :disabled="loadingData"
            @blur="$v.lastName.$touch()"
          />
          <span
            v-if="$v.lastName.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.lastName.$errors[0].$message }}
          </span>
        </div>
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
        <div v-if="isEmailChanging">
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
        <div v-if="isEmailChanging">
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
            autocomplete="password"
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
          data-testid="account-personal-data-submit-button"
        >
          {{ $t("form.save") }}
        </button>
      </div>
    </form>
  </div>
</template>
