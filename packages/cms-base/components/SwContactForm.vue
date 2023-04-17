<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { sendContactForm } from "@shopware-pwa/api-client";
import {
  CmsElementForm,
  useNavigationContext,
} from "@shopware-pwa/composables-next";
import { ClientApiError } from "@shopware-pwa/types";

const props = withDefaults(
  defineProps<{
    content: CmsElementForm;
    translations: {
      messages: {
        submitSuccess: string
      },
      salutation: string
      salutationPlaceholder: string,
      firstName: string
      firstNamePlaceholder: string
      lastName: string
      lastNamePlaceholder: string
      email: string
      emailPlaceholder: string
      phone: string
      phonePlaceholder: string
      subject: string
      subjectPlaceholder: string
      comment: string
      commentPlaceholder: string
      privacy: string
      dataProtection: string
      submit: string
    }
  }>(), {
  translations: () => ({
    messages: {
      submitSuccess: "We have received your contact request and will process it as soon as possible."
    },
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
    submit: "Submit"
  })
});


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
    props.translations.messages.submitSuccess
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
          <label for="salutation">{{props.translations.salutation}} *</label>
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
            <option disabled selected value="">{{props.translations.salutationPlaceholder}}</option>
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
          <label for="first-name">{{ props.translations.firstName }} *</label>
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
            :placeholder="props.translations.firstNamePlaceholder"
          />
          <span
            v-if="$v.firstName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.firstName.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-4">
          <label for="last-name">{{props.translations.lastName}} *</label>
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
            :placeholder="props.translations.lastNamePlaceholder"
          />
          <span
            v-if="$v.lastName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.lastName.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-6">
          <label for="email-address">{{ props.translations.email }} *</label>
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
            :placeholder="props.translations.emailPlaceholder"
          />
          <span
            v-if="$v.email.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.email.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-6">
          <label for="phone">{{props.translations.phone}} *</label>
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
            :placeholder="props.translations.phonePlaceholder"
          />
          <span
            v-if="$v.phone.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.phone.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-12">
          <label for="subject">{{props.translations.subject}} *</label>
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
            :placeholder="props.translations.subjectPlaceholder"
          />
          <span
            v-if="$v.subject.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.subject.$errors[0].$message }}
          </span>
        </div>
        <div class="col-span-12">
          <label for="comment">{{props.translations.comment}} *</label>
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
            :placeholder="props.translations.commentPlaceholder"
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
          <label>{{props.translations.privacy }} *</label>
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
                {{props.translations.dataProtection}}
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
          {{props.translations.submit }}
        </button>
      </div>
    </template>
    <template v-else>
      <p class="py-10 text-lg text-center">{{ getConfirmationText }}</p>
    </template>
  </form>
</template>
