<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  email,
  sameAs,
  requiredIf,
} from "@vuelidate/validators";
import { ClientApiError } from "@shopware-pwa/types";

const { user, refreshUser, updatePersonalInfo, updateEmail } = useUser();

const errorMessages = ref<string[]>([]);

const isSuccess = ref(false);
const updated = ref(false);
const isUpdating = ref(false);

const state = reactive({
  firstName: user.value?.firstName !== undefined ? user.value.firstName : "",
  lastName: user.value?.lastName !== undefined ? user.value.lastName : "",
  email: user.value?.email !== undefined ? user.value.email : "",
  emailConfirmation: "",
  password: "",
  salutationId: user.value?.email !== undefined ? user.value.email : "",
  title: user.value?.title !== undefined ? user.value.title : "",
});

const isEmailChanging = computed(() => state.email !== user.value?.email);

const isNameChanging = computed(
  () =>
    state.firstName !== user.value?.firstName ||
    state.lastName !== user.value?.lastName
);

const refs = toRefs(state);

const emailConfirmationValidationRule = computed(() =>
  isEmailChanging.value
    ? {
        required,
        email,
        sameAsEmail: sameAs(refs.email),
      }
    : {}
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
    const e = err as ClientApiError;
    errorMessages.value = e.messages.map((m) => m.detail);
  }
};
</script>
<template>
  <div class="space-y-8">
    <div class="text-sm text-gray-500">
      <div>
        Feel free to edit any of your details below so your account is always up
        to date
      </div>
    </div>
    <form class="mt-8 space-y-6" @submit.prevent="invokeUpdate">
      <div
        v-if="isSuccess"
        class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg"
        role="alert"
      >
        <span class="font-medium">Your information has been updated.</span>
      </div>
      <div
        class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
        v-if="errorMessages.length"
      >
        {{ errorMessages }}
      </div>
      <div class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
        <div>
          <label
            for="firstname"
            class="block mb-2 text-sm font-medium text-gray-500"
          >
            First name
          </label>
          <input
            id="firstname"
            v-model="state.firstName"
            name="firstname"
            type="text"
            autocomplete="firstname"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="Enter first name..."
            @blur="$v.firstName.$touch()"
          />
          <span
            v-if="$v.firstName.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.firstName.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="lastname"
            class="block mb-2 text-sm font-medium text-gray-500"
          >
            Last name
          </label>
          <input
            id="lastname"
            v-model="state.lastName"
            name="lastname"
            type="text"
            autocomplete="lastname"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="Enter last name..."
            @blur="$v.lastName.$touch()"
          />
          <span
            v-if="$v.lastName.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.lastName.$errors[0].$message }}
          </span>
        </div>
        <div>
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-500"
          >
            Your email
          </label>
          <input
            id="email"
            v-model="state.email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="Enter the email..."
            @blur="$v.email.$touch()"
          />
          <span
            v-if="$v.email.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.email.$errors[0].$message }}
          </span>
        </div>
        <div v-if="isEmailChanging">
          <label
            for="email-confirm"
            class="block mb-2 text-sm font-medium text-gray-500"
          >
            Confirm e-mail
          </label>
          <input
            id="email-confirm"
            v-model="state.emailConfirmation"
            name="email-confirm"
            type="email"
            autocomplete="email-confirm"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="Enter the email..."
            @blur="$v.emailConfirmation.$touch()"
          />
          <span
            v-if="$v.emailConfirmation.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.emailConfirmation.$errors[0].$message }}
          </span>
        </div>
        <div v-if="isEmailChanging">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-500"
          >
            Your password
          </label>
          <input
            id="password"
            v-model="state.password"
            name="password"
            type="password"
            autocomplete="password"
            required
            class="appearance-none rounded-md shadow-sm relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
            placeholder="••••••••"
            @blur="$v.password.$touch()"
          />
          <span
            v-if="$v.password.$error"
            class="text-red-600 focus:ring-brand-primary border-gray-300 rounded"
          >
            {{ $v.password.$errors[0].$message }}
          </span>
        </div>
      </div>

      <div>
        <button
          class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-primary"
          type="submit"
        >
          Save changes
        </button>
      </div>
    </form>
  </div>
</template>
