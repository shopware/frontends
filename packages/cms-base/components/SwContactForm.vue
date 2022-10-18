<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { sendContactForm } from "@shopware-pwa/api-client";
import {
  CmsElementForm,
  useNavigationContext,
} from "@shopware-pwa/composables-next";
import { ClientApiError } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsElementForm;
}>();
const loading = ref<boolean>();
const formSent = ref<boolean>(false);
const errorMessages = ref<any[]>([]);
const { getSalutations } = useSalutations();
const { foreignKey } = useNavigationContext();
const { apiInstance } = useShopwareContext();
const { getConfigValue } = useCmsElementConfig(props.content);

const getConfirmationText = computed(
  () =>
    getConfigValue("confirmationText") ??
    "We have received your contact request and will process it as soon as possible."
);
const getFormTitle = computed(() => getConfigValue("title") || "Contact");
const state = reactive({
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  comment: "",
  phone: "",
  checkbox: false,
});

const rules = computed(() => ({
  email: {
    required,
    email,
  },
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  salutationId: {
    required,
  },
  phone: {
    required,
    minLength: minLength(3),
  },
  subject: {
    required,
    minLength: minLength(3),
  },
  comment: {
    required,
    minLength: minLength(10),
  },
  checkbox: {
    required,
    isTrue: (value: any) => value === true,
  },
}));

const $v = useVuelidate(rules, state);
const invokeSubmit = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    loading.value = true;
    try {
      await sendContactForm(
        {
          ...state,
          navigationId: foreignKey.value,
        },
        apiInstance
      );
      formSent.value = true;
    } catch (e) {
      errorMessages.value = (e as ClientApiError).messages;
    } finally {
      loading.value = false;
    }
  }
};
</script>
<template>
  <form class="w-full relative" @submit.prevent="invokeSubmit">
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center z-10 bg-white/50"
    >
      <div
        class="h-15 w-15 i-carbon-progress-bar-round animate-spin c-gray-500"
      />
    </div>
    <h3 class="pb-3 mb-10 border-b border-gray-300">
      {{ getFormTitle }}
    </h3>
    <template v-if="!formSent">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-4">
          <label for="salutation">Salutation *</label>
          <select
            id="salutation"
            name="salutation"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.salutationId.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            v-model="state.salutationId"
            @blur="$v.salutationId.$touch()"
          >
            <option disabled selected value="">Enter salutation...</option>
            <option
              v-for="salutation in getSalutations"
              :key="salutation.id"
              :value="salutation.id"
            >
              {{ salutation.displayName }}
            </option>
          </select>
          <span
            v-if="$v.salutationId.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.salutationId.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-4">
          <label for="first-name">First name *</label>
          <input
            id="first-name"
            name="first-name"
            type="text"
            autocomplete="first-name"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.firstName.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            @blur="$v.firstName.$touch()"
            v-model="state.firstName"
            placeholder="Enter first name..."
          />
          <span
            v-if="$v.firstName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.firstName.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-4">
          <label for="last-name">Last name *</label>
          <input
            id="last-name"
            name="last-name"
            type="text"
            autocomplete="last-name"
            v-model="state.lastName"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.lastName.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            @blur="$v.lastName.$touch()"
            placeholder="Enter last name..."
          />
          <span
            v-if="$v.lastName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.lastName.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-6">
          <label for="email-address">Email address *</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            :class="[
              $v.email.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            v-model="state.email"
            @blur="$v.email.$touch()"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Enter email address..."
          />
          <span
            v-if="$v.email.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.email.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-6">
          <label for="phone">Phone *</label>
          <input
            id="phone"
            name="phone"
            type="text"
            autocomplete="phone"
            v-model="state.phone"
            @blur="$v.phone.$touch()"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.phone.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            placeholder="Enter phone number..."
          />
          <span
            v-if="$v.phone.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.phone.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-12">
          <label for="subject">Subject *</label>
          <input
            id="subject"
            name="subject"
            type="text"
            autocomplete="subject"
            v-model="state.subject"
            @blur="$v.subject.$touch()"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.subject.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            placeholder="Enter subject..."
          />
          <span
            v-if="$v.subject.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.subject.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-12">
          <label for="comment">Comment *</label>
          <textarea
            id="comment"
            name="comment"
            type="text"
            autocomplete="comment"
            @blur="$v.comment.$touch()"
            v-model="state.comment"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.comment.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            placeholder="Enter comment..."
            rows="5"
          />
          <span
            v-if="$v.comment.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.comment.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-12">
          <label>Privacy *</label>
          <div class="flex gap-3 items-start">
            <input
              id="privacy"
              name="privacy"
              type="checkbox"
              v-model="state.checkbox"
              class="mt-1 focus:ring-indigo-500 h-4 w-4 border text-indigo-600 rounded"
              :class="[
                $v.checkbox.$error ? 'border-red-600' : 'border-gray-300',
              ]"
            />
            <div>
              <label
                :class="[$v.checkbox.$error ? 'text-red-600' : '']"
                for="privacy"
              >
                I have read the
                <a class="text-indigo-700">data protection information.</a>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-10">
        <button
          class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75"
          type="submit"
          :disabled="loading"
        >
          Submit
        </button>
      </div>
    </template>
    <template v-else>
      <p class="py-10 text-lg text-center">{{ getConfirmationText }}</p>
    </template>
  </form>
</template>
