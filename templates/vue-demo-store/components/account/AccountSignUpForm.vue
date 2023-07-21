<script setup lang="ts">
import { ClientApiError } from "@shopware-pwa/types";
import {
  XMarkIcon,
} from '@heroicons/vue/24/solid';
import { SharedModal } from "../shared/SharedModal.vue";
import { required, email, minLength, maxLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();
const modal = inject<SharedModal>("modal") as SharedModal;
const { login } = useUser();
const loading = ref();
const { mergeWishlistProducts } = useWishlist();
const { pushSuccess, pushError } = useNotifications();
const loginErrors = ref<string[]>([]);
const { getSalutations } = useSalutations();
const { register } = useUser();
const router = useRouter();
const { getCountries } = useCountries();

const formData = ref({
  salutationId: getSalutations.value?.[0]?.id ?? '',
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  agree: false,
  billingAddress: {
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  }
});

watch(getSalutations, () => {
  if (!formData.value.salutationId) {
    formData.value.salutationId = getSalutations.value?.[0]?.id;
  }
});

const getCountriesOptions = computed(() => {
  return getCountries.value?.map(x => ({
    label: x.translated.name,
    value: x.id
  })) ?? []
})

const rules = computed(() => ({
  salutationId: {
    required,
  },
  firstName: {
    required,
    minLength: minLength(3),
  },
  lastName: {
    required,
    minLength: minLength(3),
  },
  email: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(8),
  },
  billingAddress: {
    street: {
      required,
      minLength: minLength(3),
    },
    zipcode: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(6),
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  },
  agree: {
    checked: (value: any) => value === true
  },
}));

const $v = useVuelidate(rules, formData);

const invokeSubmit = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    try {
      loading.value = true;
      const response = await register(formData.value as any);
      if (response) {
        emits("close");
        router.push("/account");
      }
    } catch (error) {
      let message =
        (error as ClientApiError)?.messages?.[0]?.detail ||
        "Something went wrong, please try again later";
      pushError(message);
    } finally {
      loading.value = false;
    }
  }
};

const openLogin = () => {
  emits("close");
  setTimeout(() => {
    modal.open('AccountLoginForm', {
      position: 'side'
    })
  }, 300);
}
</script>
<template>
  <div class="flex-1">
    <div class="flex h-full w-full flex-col bg-white shadow-xl p-6">
      <div class="flex flex-col h-full">
        <div class="flex items-start justify-between mb-6">
          <h2
            id="slide-over-title"
            class="text-lg capitalize font-medium text-gray-900 py-0"
          >
            {{ $t('signup') }}
          </h2>
          <div class="ml-3 flex h-7 items-center">
            <button
              type="button"
              class="-m-2 p-2 text-gray-700"
              @click="emits('close')"
            >
              <span class="sr-only">Close panel</span>
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="flex-1 min-h-0">
          <form class="flex-1 min-h-0 flex flex-col gap-6" @submit.prevent="invokeSubmit">
            <p>{{ $t('create_a_new_account') }}</p>
            <div>
              <label
                class="text-sm font-medium text-gray-700 mb-1" for="email"
                :class="{
                  'text-red-600': $v.email.$error
                }"
              >{{ $t('email_address') }}</label>
              <input
                v-model="formData.email"
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                :class="{
                  'border-red-600': $v.email.$error
                }"
              />
              <span
                v-if="$v.email.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.email.$errors[0].$params as any).type}`) }}
              </span>
            </div>
            <div>
              <label
                class="text-sm font-medium text-gray-700 mb-1"
                :class="{
                  'text-red-600': $v.firstName.$error
                }"
                for="firstname"
              >{{ $t('first_name') }}</label>
              <input
                v-model="formData.firstName"
                id="firstname"
                name="firstname"
                type="firstname"
                autocomplete="firstname"
                :class="{
                  'border-red-600': $v.firstName.$error
                }"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              />
              <span
                v-if="$v.firstName.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.firstName.$errors[0].$params as any).type}`, $v.firstName.$errors[0].$params as any) }}
              </span>
            </div>
            <div>
              <label
                class="text-sm font-medium text-gray-700 mb-1"
                :class="{
                  'text-red-600': $v.lastName.$error
                }"
                for="lastname"
              >{{ $t('last_name') }}</label>
              <input
                v-model="formData.lastName"
                id="lastname"
                name="lastname"
                type="lastname"
                autocomplete="lastname"
                :class="{
                  'border-red-600': $v.lastName.$error
                }"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              />
              <span
                v-if="$v.lastName.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.lastName.$errors[0].$params as any).type}`, $v.lastName.$errors[0].$params as any) }}
              </span>
            </div>
            <div>
              <label
                class="capitalize text-sm font-medium text-gray-700 mb-1"
                :class="{
                  'text-red-600': $v.password.$error
                }"
                for="password">{{ $t('password') }}</label>
              <input
                v-model="formData.password"
                id="password"
                name="password"
                type="password"
                autocomplete="password"
                :class="{
                  'border-red-600': $v.password.$error
                }"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              />
              <span
                v-if="$v.password.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.password.$errors[0].$params as any).type}`, $v.password.$errors[0].$params as any) }}
              </span>
            </div>
            <div>
              <label
                class="capitalize text-sm font-medium text-gray-700 mb-1"
                :class="{
                  'text-red-600': $v.billingAddress.street.$error
                }"
                for="street">{{ $t('street_address') }}</label>
              <input
                v-model="formData.billingAddress.street"
                id="street"
                name="street"
                type="text"
                autocomplete="street"
                :class="{
                  'border-red-600': $v.billingAddress.street.$error
                }"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              />
              <span
                v-if="$v.billingAddress.street.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.billingAddress.street.$errors[0].$params as any).type}`, $v.billingAddress.street.$errors[0].$params as any) }}
              </span>
            </div>
            <div class="flex gap-4">
              <div class="w-1/3">
                <label class="text-sm font-medium text-gray-700 mb-1" for="zipcode"
                  :class="{
                    'text-red-600': $v.billingAddress.zipcode.$error
                  }"
                >{{ $t('zip_code') }}</label>
                <input
                  v-model="formData.billingAddress.zipcode"
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  autocomplete="zipcode"
                  :class="{
                    'border-red-600': $v.billingAddress.zipcode.$error
                  }"
                  class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                />
                <span
                  v-if="$v.billingAddress.zipcode.$error"
                  class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
                >
                  {{ $t(`validation.${($v.billingAddress.zipcode.$errors[0].$params as any).type}`, $v.billingAddress.zipcode.$errors[0].$params as any) }}
                </span>
              </div>
              <div class="w-2/3">
                <label class="text-sm font-medium text-gray-700 mb-1"
                  for="city"
                  :class="{
                    'text-red-600': $v.billingAddress.city.$error
                  }"
                >{{ $t('city') }}</label>
                <input
                  v-model="formData.billingAddress.city"
                  id="city"
                  name="city"
                  type="text"
                  autocomplete="city"
                  :class="{
                    'border-red-600': $v.billingAddress.city.$error
                  }"
                  class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
                />
                <span
                  v-if="$v.billingAddress.city.$error"
                  class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
                >
                  {{ $t(`validation.${($v.billingAddress.city.$errors[0].$params as any).type}`, $v.billingAddress.city.$errors[0].$params as any) }}
                </span>
              </div>
            </div>
            <div>
              <label 
                class="text-sm font-medium text-gray-700 mb-1" 
                :class="{
                  'text-red-600': $v.billingAddress.countryId.$error
                }"
                for="city">{{ $t('country') }}</label>
              <SwSelect
                :compact="false"
                id="country"
                v-model="formData.billingAddress.countryId"
                name="country"
                autocomplete="country-name"
                :options="getCountriesOptions"
                :placeholder="$t('choose_country_placeholder')"
                :class="{
                  'border-red-600': $v.billingAddress.countryId.$error
                }"
              />
              <span
                v-if="$v.billingAddress.countryId.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.billingAddress.countryId.$errors[0].$params as any).type}`, $v.billingAddress.countryId.$errors[0].$params as any) }}
              </span>
            </div>
            <div class="">
              <SharedCheckbox
                :content="$t('agree_data_protection', [
                  `<a class='underline' target='_blank' href='#'>${$t('data_protection_information')}</a>`,
                  `<a class='underline' target='_blank' href='#'>${$t('general_terms_and_conditions')}</a>`
                  ])"
                :error="!!$v.agree.$error"
                v-model="formData.agree"
              />
            </div>
            <button
              type="submit"
              class="flex capitalize items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800 disabled:opacity-50"
              :disabled="loading"
            >
              {{ $t('create_account') }}
            </button>
          </form>
          <nuxt-link @click="openLogin" class="mt-5 block text-center cursor-pointer font-medium text-base underline">{{ $t('or_log_in_to_your_account') }}</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
