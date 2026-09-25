<script setup lang="ts">
import { ApiClientError, isTimeoutError } from "@shopware/api-client";
import { getTranslatedProperty } from "@shopware/helpers";

import type { operations } from "#shopware";

const { register, isLoggedIn, isGuestSession, user } = useUser();
const { getSalutations } = useSalutations();
const { getCountriesOptions, getStatesForCountry } = useCountries();

type RegisterPayload = Omit<
  operations["register post /account/register"]["body"],
  "storefrontUrl"
>;

const form = reactive<RegisterPayload>({
  accountType: "private",
  salutationId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  acceptedDataProtection: false,
  billingAddress: {
    id: "",
    customerId: "",
    firstName: "",
    lastName: "",
    company: "",
    street: "",
    zipcode: "",
    city: "",
    countryId: "",
    countryStateId: "",
  },
});

const vatId = ref("");
const isSubmitting = ref(false);
const registerError = ref("");
const errorsByPointer = reactive<Record<string, string>>({});
const isAwaitingConfirmation = ref(false);
const confirmation = ref<HTMLElement>();

const renderedPointers = new Set([
  "/email",
  "/password",
  "/billingAddress/company",
  "/billingAddress/street",
  "/billingAddress/zipcode",
  "/billingAddress/city",
  "/billingAddress/countryId",
]);

const countryStates = computed(() =>
  getStatesForCountry(form.billingAddress.countryId),
);

watch(
  () => form.billingAddress.countryId,
  () => {
    form.billingAddress.countryStateId = "";
  },
);

const accountTypeModel = computed({
  get: () => form.accountType ?? "private",
  set: (value: "private" | "business") => {
    form.accountType = value;
  },
});

const violationMessages: Record<string, string> = {
  "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE":
    "An account with this email address already exists.",
  "VIOLATION::IS_BLANK_ERROR": "This field is required.",
  "VIOLATION::TOO_SHORT_ERROR": "This value is too short.",
  "VIOLATION::ZIP_CODE_INVALID":
    "This postal code is not valid for the selected country.",
  "VIOLATION::VAT_ID_FORMAT_NOT_CORRECT":
    "This VAT ID does not have the correct format.",
};

const formMessageFor = (code?: string) =>
  (code && violationMessages[code]) || "The account could not be created.";

const fieldMessageFor = (code?: string) =>
  (code && violationMessages[code]) || "Please check this value.";

const submit = async () => {
  if (isSubmitting.value) return;

  registerError.value = "";
  for (const key of Object.keys(errorsByPointer)) {
    delete errorsByPointer[key];
  }
  isSubmitting.value = true;

  try {
    const isBusiness = form.accountType === "business";
    const customer = await register({
      ...form,
      ...(isBusiness
        ? { company: form.billingAddress.company, vatIds: [vatId.value] }
        : { company: null, vatIds: null }),
      billingAddress: {
        ...form.billingAddress,
        firstName: form.firstName,
        lastName: form.lastName,
      },
    });

    isAwaitingConfirmation.value = !!customer.doubleOptInRegistration;
    await nextTick();
    confirmation.value?.focus();
  } catch (error) {
    if (error instanceof ApiClientError) {
      const apiErrors = error.details?.errors ?? [];
      const formMessages: string[] = [];
      let shownInField = false;

      for (const apiError of apiErrors) {
        const pointer = apiError.source?.pointer;

        if (pointer && renderedPointers.has(pointer)) {
          errorsByPointer[pointer] = fieldMessageFor(apiError.code);
          shownInField = true;
        } else {
          formMessages.push(formMessageFor(apiError.code));
        }
      }

      if (formMessages.length) {
        registerError.value = formMessages.join(" ");
      } else if (!shownInField) {
        registerError.value = formMessageFor();
      }
    } else if (isTimeoutError(error)) {
      registerError.value =
        "The request timed out. Your account may already exist, so try signing in before registering again.";
    } else {
      console.error(error);
      registerError.value =
        "We could not confirm your registration. Your account may already exist, so try signing in before registering again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <p v-if="registerError" role="alert">{{ registerError }}</p>

  <p
    v-if="isAwaitingConfirmation"
    ref="confirmation"
    tabindex="-1"
    role="status"
  >
    Check your inbox and open the confirmation link to activate the account.
  </p>

  <p v-else-if="isLoggedIn" role="status">
    Signed in as {{ user?.firstName || user?.email }}
  </p>

  <template v-else>
    <p v-if="isGuestSession" role="status">
      Continuing as a guest with {{ user?.email }}. Create an account below to
      keep your order history.
    </p>

    <form @submit.prevent="submit">
      <h2>Create an account</h2>

      <label>
        Account type
        <select v-model="accountTypeModel">
          <option value="private">Private</option>
          <option value="business">Business</option>
        </select>
      </label>

      <label>
        Salutation
        <select
          v-model="form.salutationId"
          autocomplete="honorific-prefix"
          required
        >
          <option value="" disabled>Please select</option>
          <option
            v-for="salutation in getSalutations"
            :key="salutation.id"
            :value="salutation.id"
          >
            {{ getTranslatedProperty(salutation, "displayName") }}
          </option>
        </select>
      </label>

      <label>
        First name
        <input v-model="form.firstName" autocomplete="given-name" required />
      </label>

      <label>
        Last name
        <input v-model="form.lastName" autocomplete="family-name" required />
      </label>

      <label>
        Email
        <input
          v-model="form.email"
          type="email"
          autocomplete="email"
          required
          :aria-invalid="errorsByPointer['/email'] ? true : undefined"
          :aria-describedby="
            errorsByPointer['/email'] ? 'email-error' : undefined
          "
        />
      </label>
      <p v-if="errorsByPointer['/email']" id="email-error">
        {{ errorsByPointer["/email"] }}
      </p>

      <label>
        Password
        <input
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorsByPointer['/password'] ? true : undefined"
          :aria-describedby="
            errorsByPointer['/password'] ? 'password-error' : undefined
          "
        />
      </label>
      <p v-if="errorsByPointer['/password']" id="password-error">
        {{ errorsByPointer["/password"] }}
      </p>

      <fieldset>
        <legend>Billing address</legend>

        <template v-if="accountTypeModel === 'business'">
          <label>
            Company
            <input
              v-model="form.billingAddress.company"
              autocomplete="organization"
              required
              :aria-invalid="
                errorsByPointer['/billingAddress/company'] ? true : undefined
              "
              :aria-describedby="
                errorsByPointer['/billingAddress/company']
                  ? 'company-error'
                  : undefined
              "
            />
          </label>
          <p
            v-if="errorsByPointer['/billingAddress/company']"
            id="company-error"
          >
            {{ errorsByPointer["/billingAddress/company"] }}
          </p>

          <label>
            VAT ID
            <input v-model="vatId" required />
          </label>
        </template>

        <label>
          Street
          <input
            v-model="form.billingAddress.street"
            autocomplete="street-address"
            required
            :aria-invalid="
              errorsByPointer['/billingAddress/street'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/street']
                ? 'street-error'
                : undefined
            "
          />
        </label>
        <p v-if="errorsByPointer['/billingAddress/street']" id="street-error">
          {{ errorsByPointer["/billingAddress/street"] }}
        </p>

        <label>
          Postal code
          <input
            v-model="form.billingAddress.zipcode"
            autocomplete="postal-code"
            :aria-invalid="
              errorsByPointer['/billingAddress/zipcode'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/zipcode']
                ? 'zipcode-error'
                : undefined
            "
          />
        </label>
        <p v-if="errorsByPointer['/billingAddress/zipcode']" id="zipcode-error">
          {{ errorsByPointer["/billingAddress/zipcode"] }}
        </p>

        <label>
          City
          <input
            v-model="form.billingAddress.city"
            autocomplete="address-level2"
            required
            :aria-invalid="
              errorsByPointer['/billingAddress/city'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/city'] ? 'city-error' : undefined
            "
          />
        </label>
        <p v-if="errorsByPointer['/billingAddress/city']" id="city-error">
          {{ errorsByPointer["/billingAddress/city"] }}
        </p>

        <label>
          Country
          <select
            v-model="form.billingAddress.countryId"
            autocomplete="country"
            required
            :aria-invalid="
              errorsByPointer['/billingAddress/countryId'] ? true : undefined
            "
            :aria-describedby="
              errorsByPointer['/billingAddress/countryId']
                ? 'country-error'
                : undefined
            "
          >
            <option value="" disabled>Please select</option>
            <option
              v-for="country in getCountriesOptions"
              :key="country.value"
              :value="country.value"
            >
              {{ country.label }}
            </option>
          </select>
        </label>
        <p
          v-if="errorsByPointer['/billingAddress/countryId']"
          id="country-error"
        >
          {{ errorsByPointer["/billingAddress/countryId"] }}
        </p>

        <label v-if="countryStates?.length">
          State
          <select
            v-model="form.billingAddress.countryStateId"
            autocomplete="address-level1"
          >
            <option value="">Please select</option>
            <option
              v-for="state in countryStates"
              :key="state.id"
              :value="state.id"
            >
              {{ getTranslatedProperty(state, "name") }}
            </option>
          </select>
        </label>
      </fieldset>

      <label>
        <input v-model="form.acceptedDataProtection" type="checkbox" required />
        I accept the data protection terms
      </label>

      <button
        type="submit"
        :aria-disabled="isSubmitting"
        :aria-busy="isSubmitting"
      >
        {{ isSubmitting ? "Creating account..." : "Create account" }}
      </button>
    </form>
  </template>
</template>
