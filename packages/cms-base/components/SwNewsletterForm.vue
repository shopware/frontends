<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import type { CmsElementForm } from "@shopware-pwa/composables-next";
import type { ClientApiError } from "@shopware-pwa/types";

const props = defineProps<{
  content: CmsElementForm;
}>();
const loading = ref<boolean>();
const formSent = ref<boolean>(false);
const errorMessages = ref<any[]>([]);
const subscriptionOptions: {
  label: string;
  value: "subscribe" | "unsubscribe";
}[] = [
  {
    label: "Subscribe to newsletter",
    value: "subscribe",
  },
  {
    label: "Unsubscribe to newsletter",
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

const rules = computed(() => {
  let temp: any = {
    email: {
      required,
      email,
    },
    checkbox: {
      required,
      isTrue: (value: any) => value === true,
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
      {{
        getFormTitle
          ? getFormTitle
          : state.option === "subscribe"
          ? "Subscribe to newsletter"
          : "Unsubscribe to newsletter"
      }}
    </h3>
    <template v-if="!formSent">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12">
          <label for="option">Action *</label>
          <select
            id="option"
            name="option"
            class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            v-model="state.option"
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
        <div v-if="state.option === 'subscribe'" class="col-span-4">
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
        <div v-if="state.option === 'subscribe'" class="col-span-4">
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
        <div v-if="state.option === 'subscribe'" class="col-span-4">
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
      <p class="py-10 text-lg text-center">
        Be aware of upcoming sales and events. Receive gifts and special offers!
      </p>
    </template>
  </form>
</template>
