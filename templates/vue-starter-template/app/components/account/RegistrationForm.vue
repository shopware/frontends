<script setup lang="ts">
import { useRegle } from "@regle/core";
import { useTemplateRef } from "vue";
import type { operations } from "#shopware";

const props = defineProps<{
  customerGroupId?: string;
}>();

const { register, isLoggedIn } = useUser();
const { handleApiError } = useApiErrorsResolver("account_registration_form");

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
  vatIds: [""] as [string, ...string[]],
  billingAddress: {
    company: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    countryStateId: "",
  },
  acceptedDataProtection: true,
};

const state = reactive<typeof initialState>(
  JSON.parse(JSON.stringify(initialState)),
);

const { r$ } = useRegle(
  state,
  registrationFormRules(
    computed(() => state.accountType),
    computed(() => state.billingAddress.countryId),
  ),
);
const invokeSubmit = async () => {
  r$.$touch();
  const { valid } = await r$.$validate();
  if (valid) {
    try {
      loading.value = true;
      // TODO use full type form with the new template
      const response = await register(
        state as unknown as Omit<
          operations["register post /account/register"]["body"],
          "storefrontUrl"
        >,
      );
      if (response?.doubleOptInRegistration) {
        Object.assign(state, JSON.parse(JSON.stringify(initialState)));
        showDoubleOptInBox.value = true;
        await nextTick();
        doubleOptInBox.value?.scrollIntoView();
        r$.$reset();
      } else if (response?.active) router.push("/");
    } catch (error) {
      handleApiError(error);
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
          :errorMessage="r$.firstName.$errors[0]"
          @blur="r$.firstName.$touch()"
          data-testid="registration-first-name-input"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          id="lastName"
          v-model="state.lastName"
          autocomplete="family-name"
          :label="$t('form.lastName')"
          :errorMessage="r$.lastName.$errors[0]"
          @blur="r$.firstName.$touch()"
          data-testid="registration-last-name-input"
        />

        <FormInputField
          class="col-span-12 md:col-span-6"
          id="emailAddress"
          v-model="state.email"
          autocomplete="email"
          :label="$t('form.email')"
          :errorMessage="r$.email.$errors[0]"
          @blur="r$.email.$touch()"
          data-testid="registration-email-input"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          id="password"
          v-model="state.password"
          autocomplete="current-password"
          type="password"
          :label="$t('form.password')"
          :errorMessage="r$.password.$errors[0]"
          @blur="r$.password.$touch()"
          data-testid="registration-password-input"
        />

        <FormInputField
          v-if="state.accountType === 'business'"
          class="col-span-12 md:col-span-4"
          id="vatId"
          v-model="state.vatIds[0]"
          :label="$t('form.vatId')"
          @blur="r$.vatIds.$touch()"
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
          @blur="r$.billingAddress.company.$touch()"
          :errorMessage="r$.billingAddress.company.$errors[0]"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          id="street"
          v-model="state.billingAddress.street"
          autocomplete="street-address"
          :label="$t('form.streetAddress')"
          data-testid="registration-street-input"
          @blur="r$.billingAddress.street.$touch()"
          :errorMessage="r$.billingAddress.street.$errors[0]"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          :label="$t('form.postalCode')"
          id="zipcode"
          v-model="state.billingAddress.zipcode"
          autocomplete="postal-code"
          data-testid="registration-zipcode-input"
          @blur="r$.billingAddress.zipcode.$touch()"
          :errorMessage="r$.billingAddress.zipcode.$errors[0]"
        />

        <FormInputField
          class="col-span-12 md:col-span-4"
          :label="$t('form.city')"
          id="city"
          v-model="state.billingAddress.city"
          autocomplete="address-level2"
          data-testid="registration-city-input"
          @blur="r$.billingAddress.city.$touch()"
          :errorMessage="r$.billingAddress.city.$errors[0]"
        />

        <SharedCountryStateInput
          v-model:country-id="state.billingAddress.countryId"
          v-model:state-id="state.billingAddress.countryStateId"
          :country-id-validation="r$.billingAddress.countryId"
          :state-id-validation="r$.billingAddress.countryStateId"
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
