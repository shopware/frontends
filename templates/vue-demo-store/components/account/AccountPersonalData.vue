<script setup lang="ts">
import { customValidators } from "@/i18n/utils/i18n-validators";
import { ApiClientError, type ApiError } from "@shopware/api-client";
import { useVuelidate } from "@vuelidate/core";

const { required, requiredIf } = customValidators();
const { user, refreshUser, updatePersonalInfo } = useUser();

const errorMessages = ref<string[]>([]);

const isSuccess = ref(false);
const updated = ref(false);
const isUpdating = ref(false);
const loadingData = ref(false);

const state = reactive({
  firstName: "",
  lastName: "",
  salutationId: "",
  title: "",
  accountType: "private" as "private" | "business",
  company: "",
  vatIds: "",
});

const rules = computed(() => ({
  firstName: {
    required,
  },
  lastName: {
    required,
  },
  accountType: {
    required,
  },
  company: {
    required: requiredIf(() => {
      return state.accountType === "business";
    }),
  },
  vatIds: {
    required: requiredIf(() => {
      return state.accountType === "business";
    }),
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

    const valid = await $v.value.$validate();
    if (!valid) {
      return;
    }

    isUpdating.value = true;

    if (state.accountType === "business") {
      await updatePersonalInfo({
        firstName: state.firstName,
        lastName: state.lastName,
        salutationId: state.salutationId,
        title: state.title,
        company: state.company,
        vatIds: [state.vatIds],
        accountType: state.accountType,
      });
    } else {
      await updatePersonalInfo({
        firstName: state.firstName,
        lastName: state.lastName,
        salutationId: state.salutationId,
        title: state.title,
      });
    }

    isSuccess.value = true;

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
  state.salutationId = user.value?.salutationId || "";
  state.title = user.value?.title || "";
  state.accountType = user.value?.accountType || "private";

  if (user.value?.accountType === "business") {
    state.vatIds = user.value?.vatIds[0] || "";
    state.company = user.value?.company || "";
  }

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
        <div class="col-span-12">
          <label
            for="accountType"
            class="block mb-2 text-sm font-medium text-secondary-500"
            >{{ $t("form.accountType.title") }}</label
          >
          <select
            id="accountType"
            v-model="state.accountType"
            name="accountType"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            data-testid="registration-account-type-select"
            @blur="$v.accountType.$touch()"
          >
            <option value="private">
              {{ $t("form.accountType.private") }}
            </option>
            <option value="business">
              {{ $t("form.accountType.business") }}
            </option>
          </select>
          <span
            v-if="$v.accountType.$error"
            class="text-red-600 focus:ring-primary border-secondary-300 rounded"
          >
            {{ $v.accountType.$errors[0].$message }}
          </span>
        </div>

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
        <template v-if="state.accountType === 'business'">
          <div>
            <label
              for="company"
              class="block mb-2 text-sm font-medium text-secondary-500"
            >
              {{ $t("form.company") }}
            </label>
            <input
              id="company"
              v-model="state.company"
              name="company"
              type="text"
              autocomplete="on"
              required
              class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('form.companyPlaceholder')"
              data-testid="account-personal-data-company-input"
              :disabled="loadingData"
              @blur="$v.company.$touch()"
            />
            <span
              v-if="$v.company.$error"
              class="text-red-600 focus:ring-primary border-secondary-300 rounded"
            >
              {{ $v.company.$errors[0].$message }}
            </span>
          </div>

          <div>
            <label
              for="vatIds"
              class="block mb-2 text-sm font-medium text-secondary-500"
            >
              {{ $t("form.vatIds") }}
            </label>
            <input
              id="vatIds"
              v-model="state.vatIds"
              name="vatIds"
              type="text"
              autocomplete="on"
              required
              class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-secondary-300 text-secondary-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              :placeholder="$t('form.vatIdPlaceholder')"
              data-testid="account-personal-data-vatIds-input"
              :disabled="loadingData"
              @blur="$v.vatIds.$touch()"
            />
            <span
              v-if="$v.vatIds.$error"
              class="text-red-600 focus:ring-primary border-secondary-300 rounded"
            >
              {{ $v.vatIds.$errors[0].$message }}
            </span>
          </div>
        </template>
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
