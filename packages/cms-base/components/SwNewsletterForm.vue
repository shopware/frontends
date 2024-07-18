<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import type { ValidationRuleWithoutParams } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import type { CmsElementForm } from "@shopware-pwa/composables-next";
import { useCmsTranslations } from "@shopware-pwa/composables-next";
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";
import { useCmsElementConfig, useNewsletter, useSalutations } from "#imports";
import { computed, reactive, ref } from "vue";
import { defu } from "defu";

const props = defineProps<{
  content: CmsElementForm;
}>();

type Translations = {
  form: {
    subscribeLabel: string;
    unsubscribeLabel: string;
    action: string;
    email: string;
    emailPlaceholder: string;
    salutation: string;
    salutationPlaceholder: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    privacy: string;
    privacyLabel: string;
    submit: string;
    newsletterBenefits: string;
  };
};

let translations: Translations = {
  form: {
    subscribeLabel: "Subscribe to newsletter",
    unsubscribeLabel: "Unsubscribe from newsletter",
    action: "Action",
    email: "Email address",
    emailPlaceholder: "Enter email address...",
    salutation: "Salutation",
    salutationPlaceholder: "Enter salutation...",
    firstName: "First name",
    firstNamePlaceholder: "Enter first name...",
    lastName: "Last name",
    lastNamePlaceholder: "Enter last name...",
    privacy: "Privacy",
    privacyLabel: "I have read the data protection information.",
    submit: "Submit",
    newsletterBenefits:
      "Be aware of upcoming sales and events.Receive gifts and special offers!",
  },
};

translations = defu(useCmsTranslations(), translations) as Translations;

const loading = ref<boolean>();
const formSent = ref<boolean>(false);
const errorMessages = ref<ApiError[]>([]);
const subscriptionOptions: {
  label: string;
  value: "subscribe" | "unsubscribe";
}[] = [
  {
    label: translations.form.subscribeLabel,
    value: "subscribe",
  },
  {
    label: translations.form.unsubscribeLabel,
    value: "unsubscribe",
  },
];
const { getSalutations } = useSalutations();
const { getConfigValue } = useCmsElementConfig(props.content);
const { newsletterSubscribe, newsletterUnsubscribe } = useNewsletter();

const getFormTitle = computed(() => getConfigValue("title"));
const state = reactive({
  option: subscriptionOptions[0].value,
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  checkbox: false,
});

type Rules = {
  email: {
    required: ValidationRuleWithoutParams;
    email: ValidationRuleWithoutParams;
  };
  checkbox: {
    required: ValidationRuleWithoutParams;
    isTrue: (value: boolean) => boolean;
  };
  firstName: {
    required: ValidationRuleWithoutParams;
    minLength: number;
  };
  lastName: {
    required: ValidationRuleWithoutParams;
    minLength: number;
  };
  salutationId: {
    required: ValidationRuleWithoutParams;
  };
};
const rules = computed(() => {
  let temp: Partial<Rules> = {
    email: {
      required,
      email,
    },
    checkbox: {
      required,
      isTrue: (value: boolean) => value === true,
    },
  };
  if (state.option === "subscribe") {
    temp = {
      ...temp,
      firstName: {
        required,
        minLength: 3,
      },
      lastName: {
        required,
        minLength: 3,
      },
      salutationId: {
        required,
      },
    };
  }
  return temp;
});

const $v = useVuelidate(rules, state);
const invokeSubmit = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    loading.value = true;
    try {
      if (state.option === "subscribe") {
        await newsletterSubscribe({
          ...state,
        });
      } else {
        await newsletterUnsubscribe(state.email);
      }
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
      {{
        getFormTitle
          ? getFormTitle
          : state.option === "subscribe"
            ? translations.form.subscribeLabel
            : translations.form.unsubscribeLabel
      }}
    </h3>
    <template v-if="!formSent">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12">
          <label for="option">{{ translations.form.action }} *</label>
          <select
            id="option"
            v-model="state.option"
            name="option"
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
          >
            <option
              v-for="subscription in subscriptionOptions"
              :key="subscription.value"
              :value="subscription.value"
            >
              {{ subscription.label }}
            </option>
          </select>
        </div>
        <div class="col-span-12">
          <label for="email-address">{{ translations.form.email }} *</label>
          <input
            id="email-address"
            v-model="state.email"
            name="email"
            type="email"
            autocomplete="email"
            :class="[
              $v.email?.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :placeholder="translations.form.emailPlaceholder"
            @blur="$v.email?.$touch()"
          />
          <span
            v-if="$v.email?.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.email?.$errors[0].$message }}
          </span>
        </div>
        <div v-if="state.option === 'subscribe'" class="col-span-4">
          <label for="salutation">{{ translations.form.salutation }} *</label>
          <select
            id="salutation"
            v-model="state.salutationId"
            name="salutation"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.salutationId?.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            @blur="$v.salutationId?.$touch()"
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
          <span
            v-if="$v.salutationId?.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.salutationId?.$errors[0].$message }}
          </span>
        </div>
        <div v-if="state.option === 'subscribe'" class="col-span-4">
          <label for="first-name">{{ translations.form.firstName }} *</label>
          <input
            id="first-name"
            v-model="state.firstName"
            name="first-name"
            type="text"
            autocomplete="first-name"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.firstName?.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="translations.form.firstNamePlaceholder"
            @blur="$v.firstName?.$touch()"
          />
          <span
            v-if="$v.firstName?.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.firstName?.$errors[0].$message }}
          </span>
        </div>
        <div v-if="state.option === 'subscribe'" class="col-span-4">
          <label for="last-name">{{ translations.form.lastName }} *</label>
          <input
            id="last-name"
            v-model="state.lastName"
            name="last-name"
            type="text"
            autocomplete="last-name"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.lastName?.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="translations.form.lastNamePlaceholder"
            @blur="$v.lastName?.$touch()"
          />
          <span
            v-if="$v.lastName?.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.lastName?.$errors[0].$message }}
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
                $v.checkbox?.$error ? 'border-red-600' : 'border-gray-300',
              ]"
            />
            <div>
              <label
                :class="[$v.checkbox?.$error ? 'text-red-600' : '']"
                for="privacy"
              >
                {{ translations.form.privacyLabel }}
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
      <p class="py-10 text-lg text-center">
        {{ translations.form.newsletterBenefits }}
      </p>
    </template>
  </form>
</template>
