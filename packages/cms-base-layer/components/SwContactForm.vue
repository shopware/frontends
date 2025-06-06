<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import type { CmsElementForm } from "@shopware/composables";
import { useCmsTranslations } from "@shopware/composables";
import { useVuelidate } from "@vuelidate/core";
import { email, minLength, required } from "@vuelidate/validators";
import { defu } from "defu";
import { computed, reactive, ref } from "vue";
import {
  useCmsElementConfig,
  useNavigationContext,
  useSalutations,
  useShopwareContext,
} from "#imports";

const props = defineProps<{
  content: CmsElementForm;
}>();

type Translations = {
  form: {
    salutation: string;
    salutationPlaceholder: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    comment: string;
    commentPlaceholder: string;
    privacy: string;
    dataProtection: string;
    submit: string;
    messages: {
      contactFormSuccess: string;
    };
  };
};

let translations: Translations = {
  form: {
    salutation: "Salutation",
    salutationPlaceholder: "Enter salutation...",
    firstName: "First name",
    firstNamePlaceholder: "Enter first name...",
    lastName: "Last name",
    lastNamePlaceholder: "Enter last name...",
    email: "Email address",
    emailPlaceholder: "Enter email address...",
    phone: "Phone number",
    phonePlaceholder: "Enter phone number...",
    subject: "Subject",
    subjectPlaceholder: "Enter subject...",
    comment: "Comment",
    commentPlaceholder: "Enter comment...",
    privacy: "Privacy",
    dataProtection: "I have read the data protection information.",
    submit: "Submit",
    messages: {
      contactFormSuccess:
        "We have received your contact request and will process it as soon as possible.",
    },
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const loading = ref<boolean>();
const formSent = ref<boolean>(false);

type ErrorMessages = ApiClientError<{
  errors: ApiError[];
}>;

const errorMessages = ref<ErrorMessages[]>([]);

const { getSalutations } = useSalutations();
const { foreignKey } = useNavigationContext();
const { apiClient } = useShopwareContext();
const { getConfigValue } = useCmsElementConfig(props.content);

const getConfirmationText = computed(
  () =>
    getConfigValue("confirmationText") ??
    translations.form.messages.contactFormSuccess,
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
    isTrue: (value: boolean) => value === true,
  },
}));

const $v = useVuelidate(rules, state);
const invokeSubmit = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    loading.value = true;
    try {
      await apiClient.invoke("sendContactMail post /contact-form", {
        body: {
          ...state,
          navigationId: foreignKey.value,
        },
      });
      formSent.value = true;
    } catch (e) {
      if (e instanceof ApiClientError) {
        errorMessages.value = e.details.errors;
      }
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
          <label for="salutation">{{ translations.form.salutation }}</label>
          <select
            id="salutation"
            v-model="state.salutationId"
            name="salutation"
            class="border-gray-300 focus:border-indigo-500 appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
          >
            <option disabled selected value="">
              {{ translations.form.salutationPlaceholder }}
            </option>
            <option
              v-for="salutation in getSalutations"
              :key="salutation.id"
              :value="salutation.id"
            >
              {{ salutation.displayName }}
            </option>
          </select>
        </div>
        <div class="col-span-4">
          <label for="first-name">{{ translations.form.firstName }} *</label>
          <input
            id="first-name"
            v-model="state.firstName"
            name="first-name"
            type="text"
            autocomplete="given-name"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.firstName.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="translations.form.firstNamePlaceholder"
            @blur="$v.firstName.$touch()"
          />
          <span
            v-if="$v.firstName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.firstName.$errors[0]?.$message ?? '' }}
          </span>
        </div>
        <div class="col-span-4">
          <label for="last-name">{{ translations.form.lastName }} *</label>
          <input
            id="last-name"
            v-model="state.lastName"
            name="last-name"
            type="text"
            autocomplete="family-name"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.lastName.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="translations.form.lastNamePlaceholder"
            @blur="$v.lastName.$touch()"
          />
          <span
            v-if="$v.lastName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.lastName.$errors[0]?.$message ?? '' }}
          </span>
        </div>
        <div class="col-span-6">
          <label for="email-address">{{ translations.form.email }} *</label>
          <input
            id="email-address"
            v-model="state.email"
            name="email"
            type="email"
            autocomplete="email"
            :class="[
              $v.email.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :placeholder="translations.form.emailPlaceholder"
            @blur="$v.email.$touch()"
          />
          <span
            v-if="$v.email.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.email.$errors[0]?.$message ?? '' }}
          </span>
        </div>
        <div class="col-span-6">
          <label for="phone">{{ translations.form.phone }} *</label>
          <input
            id="phone"
            v-model="state.phone"
            name="phone"
            type="text"
            autocomplete="phone"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.phone.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="translations.form.phonePlaceholder"
            @blur="$v.phone.$touch()"
          />
          <span
            v-if="$v.phone.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.phone.$errors[0]?.$message ?? '' }}
          </span>
        </div>
        <div class="col-span-12">
          <label for="subject">{{ translations.form.subject }} *</label>
          <input
            id="subject"
            v-model="state.subject"
            name="subject"
            type="text"
            autocomplete="subject"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.subject.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="translations.form.subjectPlaceholder"
            @blur="$v.subject.$touch()"
          />
          <span
            v-if="$v.subject.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.subject.$errors[0]?.$message ?? '' }}
          </span>
        </div>
        <div class="col-span-12">
          <label for="comment">{{ translations.form.comment }} *</label>
          <textarea
            id="comment"
            v-model="state.comment"
            name="comment"
            type="text"
            autocomplete="comment"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.comment.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="translations.form.commentPlaceholder"
            rows="5"
            @blur="$v.comment.$touch()"
          />
          <span
            v-if="$v.comment.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.comment.$errors[0]?.$message || '' }}
          </span>
        </div>
        <div class="col-span-12">
          <label>{{ translations.form.privacy }} *</label>
          <div class="flex gap-3 items-start">
            <input
              id="privacy"
              v-model="state.checkbox"
              name="privacy"
              type="checkbox"
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
                {{ translations.form.dataProtection }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-10">
        <button
          class="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75"
          type="submit"
        >
          {{ translations.form.submit }}
        </button>
      </div>
    </template>
    <template v-else>
      <p class="py-10 text-lg text-center">{{ getConfirmationText }}</p>
    </template>
  </form>
</template>
