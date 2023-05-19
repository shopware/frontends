<script lang="ts">
export default {
  name: "RegisterPage",
};
</script>

<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { ClientApiError } from "@shopware-pwa/types";

const { getSalutations } = useSalutations();
const { getCountries } = useCountries();
const { register, isLoggedIn } = useUser();
const { pushError } = useNotifications();

const router = useRouter();
const loading = ref<boolean>();
const doubleOptInBox = ref();
const showDoubleOptInBox = ref(false);
const { t } = useI18n();
if (process.client && isLoggedIn.value) {
  // redirect to account page if user is logged in
  navigateTo({ path: "/account" });
}

const initialState = {
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  billingAddress: {
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
  },
};

const state = reactive(JSON.parse(JSON.stringify(initialState)));

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
    },
    city: {
      required,
    },
    countryId: {
      required,
    },
  },
}));

const $v = useVuelidate(rules, state);

const invokeSubmit = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    try {
      loading.value = true;
      const response = await register(state);
      if (response && response.active) router.push("/");
      else if (response && !response.active) {
        Object.assign(state, JSON.parse(JSON.stringify(initialState)));
        showDoubleOptInBox.value = true;
        await nextTick();
        doubleOptInBox.value.scrollIntoView();
        $v.value.$reset();
      }
    } catch (error) {
      let message =
        (error as ClientApiError)?.messages?.[0]?.detail || t("messages.error");
      pushError(message);
    } finally {
      loading.value = false;
    }
  }
};

useBreadcrumbs([
  {
    name: t("breadcrumbs.register"),
    path: "/register",
  },
]);
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-6 sm:px-4">
    <div
      v-if="showDoubleOptInBox"
      ref="doubleOptInBox"
      class="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 mb-4"
    >
      {{ $t("account.messages.signUpSuccess") }}
    </div>
    <form
      class="w-full relative"
      data-testid="registration-form"
      @submit.prevent="invokeSubmit"
    >
      <h3 class="block border-b-1 mb-5 pb-2 font-bold">
        {{ $t("account.signUpHeader") }}
      </h3>
      <div class="grid grid-cols-12 gap-5 mb-10">
        <div class="col-span-12">
          <label for="salutation">{{ $t("form.salutation") }} *</label>
          <select
            id="salutation"
            v-model="state.salutationId"
            name="salutation"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :disabled="loading"
            :class="[
              $v.salutationId.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            data-testid="registration-salutation-select"
            @blur="$v.salutationId.$touch()"
          >
            <option disabled selected value="">
              {{ $t("form.chooseSalutation") }}
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
            v-if="$v.salutationId.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.salutationId.$errors[0].$message }}
          </span>
        </div>

        <div class="col-span-12 md:col-span-4">
          <label for="first-name">{{ $t("form.firstName") }} *</label>
          <input
            id="first-name"
            v-model="state.firstName"
            name="first-name"
            type="text"
            autocomplete="first-name"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.firstName.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="$t('form.firstNamePlaceholder')"
            :disabled="loading"
            data-testid="registration-first-name-input"
            @blur="$v.firstName.$touch()"
          />
          <span
            v-if="$v.firstName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.firstName.$errors[0].$message }}
          </span>
        </div>

        <div class="col-span-12 md:col-span-4">
          <label for="last-name">{{ $t("form.lastName") }} *</label>
          <input
            id="last-name"
            v-model="state.lastName"
            name="last-name"
            type="text"
            autocomplete="last-name"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.lastName.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="$t('form.lastNamePlaceholder')"
            :disabled="loading"
            data-testid="registration-last-name-input"
            @blur="$v.lastName.$touch()"
          />
          <span
            v-if="$v.lastName.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.lastName.$errors[0].$message }}
          </span>
        </div>

        <div class="col-span-12 md:col-span-6">
          <label for="email-address">{{ $t("form.email") }} *</label>
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
            :placeholder="$t('form.emailPlaceholder')"
            :disabled="loading"
            data-testid="registration-email-input"
            @blur="$v.email.$touch()"
          />
          <span
            v-if="$v.email.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.email.$errors[0].$message }}
          </span>
        </div>

        <div class="col-span-12 md:col-span-4">
          <label for="password">{{ $t("form.password") }} *</label>
          <input
            id="password"
            v-model="state.password"
            name="password"
            type="password"
            autocomplete="password"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.password.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="$t('form.passwordPlaceholder')"
            :disabled="loading"
            data-testid="registration-password-input"
            @blur="$v.password.$touch()"
          />
          <span
            v-if="$v.password.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.password.$errors[0].$message }}
          </span>
        </div>
      </div>

      <h3 class="block border-b-1 mb-5 pb-2 font-bold">
        {{ $t("account.yourAddress") }}
      </h3>
      <div class="grid grid-cols-12 gap-5 mb-10">
        <div class="col-span-12 md:col-span-4">
          <label for="street">{{ $t("form.street") }} *</label>
          <input
            id="Street"
            v-model="state.billingAddress.street"
            name="Street"
            type="text"
            autocomplete="Street"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.billingAddress.street.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="$t('form.streetPlaceholder')"
            :disabled="loading"
            data-testid="registration-street-input"
            @blur="$v.billingAddress.street.$touch()"
          />
          <span
            v-if="$v.billingAddress.street.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.billingAddress.street.$errors[0].$message }}
          </span>
        </div>

        <div class="col-span-12 md:col-span-4">
          <label for="zipcode">{{ $t("form.postalCode") }} *</label>
          <input
            id="zipcode"
            v-model="state.billingAddress.zipcode"
            name="zipcode"
            type="text"
            autocomplete="zipcode"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.billingAddress.zipcode.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="$t('form.postalCodePlaceholder')"
            :disabled="loading"
            data-testid="registration-zipcode-input"
            @blur="$v.billingAddress.zipcode.$touch()"
          />
          <span
            v-if="$v.billingAddress.zipcode.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.billingAddress.zipcode.$errors[0].$message }}
          </span>
        </div>

        <div class="col-span-12 md:col-span-4">
          <label for="city">{{ $t("form.city") }} *</label>
          <input
            id="city"
            v-model="state.billingAddress.city"
            name="city"
            type="text"
            autocomplete="city"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.billingAddress.city.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :placeholder="$t('form.cityPlaceholder')"
            :disabled="loading"
            data-testid="registration-city-input"
            @blur="$v.billingAddress.city.$touch()"
          />
          <span
            v-if="$v.billingAddress.city.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.billingAddress.city.$errors[0].$message }}
          </span>
        </div>

        <div class="col-span-12 md:col-span-4">
          <label for="country">{{ $t("form.country") }} *</label>
          <select
            id="country"
            v-model="state.billingAddress.countryId"
            name="country"
            class="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
            :class="[
              $v.billingAddress.countryId.$error
                ? 'border-red-600 focus:border-red-600'
                : 'border-gray-300 focus:border-indigo-500',
            ]"
            :disabled="loading"
            data-testid="registration-country-select"
            @blur="$v.billingAddress.countryId.$touch()"
          >
            <option disabled selected value="">
              {{ $t("form.chooseCountry") }}
            </option>
            <option
              v-for="country in getCountries"
              :key="country.id"
              :value="country.id"
            >
              {{ country.name }}
            </option>
          </select>
          <span
            v-if="$v.salutationId.$error"
            class="pt-1 text-sm text-red-600 focus:ring-brand-primary border-gray-300"
          >
            {{ $v.salutationId.$errors[0].$message }}
          </span>
        </div>
      </div>
      <div class="mb-5 text-right">
        <button
          class="group relative py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-75 w-full md:w-auto"
          type="submit"
          :disabled="loading"
          data-testid="registration-submit-button"
        >
          {{ $t("form.submit") }}
        </button>
      </div>
    </form>
  </div>
</template>
