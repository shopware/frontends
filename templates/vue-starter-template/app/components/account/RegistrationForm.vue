<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { useTemplateRef } from "vue";

const props = defineProps<{
  customerGroupId?: string;
}>();

const { register, isLoggedIn } = useUser();
const { pushError } = useNotifications();

const router = useRouter();
const loading = ref<boolean>();
const doubleOptInBox = useTemplateRef("doubleOptInBox");
const showDoubleOptInBox = ref(false);
const { t } = useI18n();
if (import.meta.client && isLoggedIn.value) {
  // redirect to account page if user is logged in
  navigateTo({ path: "/account" });
}

watch(isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    navigateTo({ path: "/account" });
  }
});

const initialState = {
  requestedGroupId: props.customerGroupId,
  accountType: "private",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  vatIds: [null],
  billingAddress: {
    company: null,
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    countryStateId: "",
  },
};

const state = reactive(JSON.parse(JSON.stringify(initialState)));

const $v = useVuelidate(
  registrationFormRules(state.accountType, state.billingAddress.countryId),
  state,
);
const invokeSubmit = async () => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    try {
      loading.value = true;
      const response = await register(state);
      if (response?.doubleOptInRegistration) {
        Object.assign(state, JSON.parse(JSON.stringify(initialState)));
        showDoubleOptInBox.value = true;
        await nextTick();
        doubleOptInBox.value?.scrollIntoView();
        $v.value.$reset();
      } else if (response?.active) router.push("/");
    } catch (error) {
      apiErrorHandler(error, "account_registration_form", pushError);
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

const accountTypeOptions = [
  {
    label: t("form.accountType.private"),
    value: "private",
  },
  {
    label: t("form.accountType.business"),
    value: "business",
  },
];
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
      v-if="!showDoubleOptInBox"
      class="w-full relative mt-10"
      data-testid="registration-form"
      @submit.prevent="invokeSubmit"
    >
      <h3 class="block border-b-1 mb-5 pb-2 font-bold">
        {{ $t("account.signUpHeader") }}
      </h3>
      <div class="grid grid-cols-12 gap-5 mb-10">
        <FormAccountTypeSelect
          class="col-span-12"
          v-model="state.accountType"
          dataTestId="registration-account-type-select"
          id="accountType"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          id="firstName"
          v-model="state.firstName"
          autocomplete="firstName"
          :label="$t('form.firstName')"
          :errorMessage="$v.firstName.$errors[0]?.$message"
          @blur="$v.firstName.$touch()"
          data-testid="registration-first-name-input"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          id="lastName"
          v-model="state.lastName"
          autocomplete="family-name"
          :label="$t('form.lastName')"
          :errorMessage="$v.lastName.$errors[0]?.$message"
          @blur="$v.firstName.$touch()"
          data-testid="registration-last-name-input"
        />

        <FormInputField
          class="col-span-12 md:col-span-6"
          id="emailAddress"
          v-model="state.email"
          autocomplete="email"
          :label="$t('form.email')"
          :errorMessage="$v.email.$errors[0]?.$message"
          @blur="$v.email.$touch()"
          data-testid="registration-email-input"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          id="password"
          v-model="state.password"
          autocomplete="current-password"
          type="password"
          :label="$t('form.password')"
          :errorMessage="$v.password.$errors[0]?.$message"
          @blur="$v.password.$touch()"
          data-testid="registration-password-input"
        />

        <FormInputField
          v-if="state.accountType === 'business'"
          class="col-span-12 md:col-span-4"
          id="vatId"
          v-model="state.vatIds[0]"
          :label="$t('form.vatId')"
          @blur="$v.vatIds.$touch()"
          data-testid="registration-vatid-input"
        />
      </div>

      <h3 class="block border-b-1 mb-5 pb-2 font-bold">
        {{ $t("account.yourAddress") }}
      </h3>
      <div class="grid grid-cols-12 gap-5 mb-5">
        <FormInputField
          v-if="state.accountType === 'business'"
          class="col-span-12 md:col-span-4"
          id="company"
          v-model="state.billingAddress.company"
          autocomplete="company"
          :label="$t('form.company')"
          data-testid="registration-company-input"
          @blur="$v.billingAddress.company.$touch()"
          :errorMessage="$v.billingAddress.company.$errors[0]?.$message"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          id="street"
          v-model="state.billingAddress.street"
          autocomplete="street-address"
          :label="$t('form.streetAddress')"
          data-testid="registration-street-input"
          @blur="$v.billingAddress.street.$touch()"
          :errorMessage="$v.billingAddress.street.$errors[0]?.$message"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          :label="$t('form.postalCode')"
          id="zipcode"
          v-model="state.billingAddress.zipcode"
          autocomplete="postal-code"
          data-testid="registration-zipcode-input"
          @blur="$v.billingAddress.zipcode.$touch()"
          :errorMessage="$v.billingAddress.zipcode.$errors[0]?.$message"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          :label="$t('form.city')"
          id="city"
          v-model="state.billingAddress.city"
          autocomplete="address-level2"
          data-testid="registration-city-input"
          @blur="$v.billingAddress.city.$touch()"
          :errorMessage="$v.billingAddress.city.$errors[0]?.$message"
        />

        <SharedCountryStateInput
          v-model:country-id="state.billingAddress.countryId"
          v-model:state-id="state.billingAddress.countryStateId"
          :country-id-validation="$v.billingAddress.countryId"
          :state-id-validation="$v.billingAddress.countryStateId"
          class="col-span-12 md:col-span-4"
        />
      </div>
      <div class="mb-5 text-right">
        <FormBaseButton
          :label="$t('form.submit')"
          type="submit"
          data-testid="registration-submit-button"
        />
      </div>
    </form>
  </div>
</template>
