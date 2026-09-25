<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

import type { operations } from "#shopware";

const {
  user,
  isCustomerSession,
  isGuestSession,
  updatePersonalInfo,
  updateEmail,
  refreshUser,
} = useUser();
const { getSalutations, fetchSalutations } = useSalutations();

const profile = reactive<
  operations["changeProfile post /account/change-profile"]["body"]
>({
  salutationId: "",
  title: "",
  firstName: "",
  lastName: "",
});

const birthday = ref("");
const accountType = ref<"private" | "business">("private");
const company = ref("");
const vatId = ref("");

const emailChange = reactive<
  operations["changeEmail post /account/change-email"]["body"]
>({
  email: "",
  emailConfirmation: "",
  password: "",
});

const isSavingProfile = ref(false);
const isSavingEmail = ref(false);
const profileError = ref("");
const emailError = ref("");
const profileFieldErrors = ref<Record<string, string>>({});
const emailFieldErrors = ref<Record<string, string>>({});
const profileSaved = ref("");
const emailSaved = ref("");
const reloadError = ref("");

const messageFor = (violation: ApiError) => {
  switch (violation.code) {
    case "VIOLATION::CUSTOMER_EMAIL_NOT_UNIQUE":
      return "That email address is already in use.";
    case "VIOLATION::CUSTOMER_PASSWORD_NOT_CORRECT":
      return "That password is not correct.";
    case "VIOLATION::IS_BLANK_ERROR":
      return "This field is required.";
    default:
      return "This value is not valid.";
  }
};

const fieldErrorsFrom = (error: unknown): Record<string, string> => {
  if (!(error instanceof ApiClientError)) return {};

  const byField: Record<string, string> = {};
  for (const violation of error.details.errors ?? []) {
    const field = violation.source?.pointer?.split("/").pop();
    if (field) byField[field] = messageFor(violation);
  }
  return byField;
};

watch(
  () => user.value?.id,
  () => {
    const customer = user.value;
    if (!customer) return;

    profile.salutationId = customer.salutationId ?? "";
    profile.title = customer.title ?? "";
    profile.firstName = customer.firstName ?? "";
    profile.lastName = customer.lastName ?? "";
    birthday.value = customer.birthday?.slice(0, 10) ?? "";

    if (customer.accountType === "business") {
      accountType.value = "business";
      company.value = customer.company;
      vatId.value = customer.vatIds[0];
    } else {
      accountType.value = "private";
      company.value = "";
      vatId.value = "";
    }
  },
  { immediate: true },
);

const saveProfile = async () => {
  if (isSavingProfile.value) return;

  profileError.value = "";
  profileFieldErrors.value = {};
  profileSaved.value = "";
  isSavingProfile.value = true;

  const [year, month, day] = birthday.value.split("-");
  const basePayload =
    year && month && day
      ? {
          ...profile,
          birthdayYear: Number(year),
          birthdayMonth: Number(month),
          birthdayDay: Number(day),
        }
      : profile;

  try {
    await updatePersonalInfo(
      accountType.value === "business"
        ? {
            ...basePayload,
            accountType: "business",
            company: company.value,
            vatIds: [vatId.value],
          }
        : basePayload,
    );
  } catch (error) {
    console.error(error);
    profileFieldErrors.value = fieldErrorsFrom(error);
    if (!Object.keys(profileFieldErrors.value).length) {
      profileError.value = "Your details could not be saved.";
    }
    isSavingProfile.value = false;
    return;
  }

  try {
    await refreshUser();
    profileSaved.value = "Your details were saved.";
  } catch (error) {
    console.error(error);
    reloadError.value =
      "Your details were saved, but we could not reload your account. Reload the page to see them.";
  } finally {
    isSavingProfile.value = false;
  }
};

const saveEmail = async () => {
  if (isSavingEmail.value) return;

  emailError.value = "";
  emailFieldErrors.value = {};
  emailSaved.value = "";
  isSavingEmail.value = true;

  try {
    await updateEmail(emailChange);
  } catch (error) {
    console.error(error);
    emailFieldErrors.value = fieldErrorsFrom(error);
    if (!Object.keys(emailFieldErrors.value).length) {
      emailError.value = "The email address could not be changed.";
    }
    isSavingEmail.value = false;
    return;
  }

  emailChange.password = "";

  try {
    await refreshUser();
    emailSaved.value = "Your email address was changed.";
  } catch (error) {
    console.error(error);
    reloadError.value =
      "Your email address was changed, but we could not reload your account. Sign in with the new address.";
  } finally {
    isSavingEmail.value = false;
  }
};
</script>

<template>
  <section>
    <h1>Your profile</h1>

    <p v-if="reloadError" role="alert">{{ reloadError }}</p>

    <p v-else-if="!user">You are not signed in.</p>

    <template v-else>
      <p v-if="isGuestSession">
        You are shopping as a guest. Set a password to keep these details.
      </p>

      <form @submit.prevent="saveProfile">
        <h2>Your details</h2>

        <p v-if="profileSaved" role="status">{{ profileSaved }}</p>
        <p v-if="profileError" role="alert">{{ profileError }}</p>

        <p v-if="!getSalutations.length" role="alert">
          The salutations are not available.
          <button type="button" @click="fetchSalutations">Retry</button>
        </p>

        <label for="salutation">Salutation</label>
        <select id="salutation" v-model="profile.salutationId">
          <option value="">Not specified</option>
          <option
            v-for="salutation in getSalutations"
            :key="salutation.id"
            :value="salutation.id"
          >
            {{ salutation.translated?.displayName ?? salutation.displayName }}
          </option>
        </select>

        <label for="first-name">First name</label>
        <input
          id="first-name"
          v-model="profile.firstName"
          type="text"
          required
          autocomplete="given-name"
          :aria-invalid="profileFieldErrors.firstName ? true : undefined"
          :aria-describedby="
            profileFieldErrors.firstName ? 'first-name-error' : undefined
          "
        />
        <p
          v-if="profileFieldErrors.firstName"
          id="first-name-error"
          role="alert"
        >
          {{ profileFieldErrors.firstName }}
        </p>

        <label for="last-name">Last name</label>
        <input
          id="last-name"
          v-model="profile.lastName"
          type="text"
          required
          autocomplete="family-name"
          :aria-invalid="profileFieldErrors.lastName ? true : undefined"
          :aria-describedby="
            profileFieldErrors.lastName ? 'last-name-error' : undefined
          "
        />
        <p v-if="profileFieldErrors.lastName" id="last-name-error" role="alert">
          {{ profileFieldErrors.lastName }}
        </p>

        <label for="birthday">Date of birth</label>
        <input
          id="birthday"
          v-model="birthday"
          type="date"
          autocomplete="bday"
        />

        <label for="account-type">Account type</label>
        <select id="account-type" v-model="accountType">
          <option value="private">Private</option>
          <option value="business">Business</option>
        </select>

        <template v-if="accountType === 'business'">
          <label for="company">Company</label>
          <input
            id="company"
            v-model="company"
            type="text"
            autocomplete="organization"
          />

          <label for="vat-id">VAT ID</label>
          <input id="vat-id" v-model="vatId" type="text" />
        </template>

        <button
          type="submit"
          :aria-disabled="isSavingProfile"
          :aria-busy="isSavingProfile"
        >
          {{ isSavingProfile ? "Saving…" : "Save my details" }}
        </button>
      </form>

      <form v-if="isCustomerSession" @submit.prevent="saveEmail">
        <h2>Email address</h2>
        <p>Currently {{ user.email }}</p>

        <p v-if="emailSaved" role="status">{{ emailSaved }}</p>
        <p v-if="emailError" role="alert">{{ emailError }}</p>

        <label for="new-email">New email</label>
        <input
          id="new-email"
          v-model="emailChange.email"
          type="email"
          required
          autocomplete="off"
          :aria-invalid="emailFieldErrors.email ? true : undefined"
          :aria-describedby="
            emailFieldErrors.email ? 'new-email-error' : undefined
          "
        />
        <p v-if="emailFieldErrors.email" id="new-email-error" role="alert">
          {{ emailFieldErrors.email }}
        </p>

        <label for="confirm-email">Repeat the new email</label>
        <input
          id="confirm-email"
          v-model="emailChange.emailConfirmation"
          type="email"
          required
          autocomplete="off"
        />

        <label for="current-password">Your password</label>
        <input
          id="current-password"
          v-model="emailChange.password"
          type="password"
          required
          autocomplete="current-password"
          :aria-invalid="emailFieldErrors.password ? true : undefined"
          :aria-describedby="
            emailFieldErrors.password ? 'password-error' : undefined
          "
        />
        <p v-if="emailFieldErrors.password" id="password-error" role="alert">
          {{ emailFieldErrors.password }}
        </p>

        <button
          type="submit"
          :aria-disabled="isSavingEmail"
          :aria-busy="isSavingEmail"
        >
          {{ isSavingEmail ? "Saving…" : "Change my email" }}
        </button>
      </form>
    </template>
  </section>
</template>
