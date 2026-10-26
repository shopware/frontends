<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";

import type { operations } from "#shopware";

type RecoveryConfirmBody =
  operations["recoveryPassword post /account/recovery-password-confirm"]["body"];
type ChangePasswordBody =
  operations["changePassword post /account/change-password"]["body"];

const { apiClient } = useShopwareContext();
const { resetPassword, updatePassword } = useCustomerPassword();
const { getStorefrontUrl } = useInternationalization();
const { isLoggedIn } = useUser();

const hash = useRoute().query.hash?.toString();

const heading = ref<HTMLElement | null>(null);

const email = ref("");
const isRecoveryRequested = ref(false);

const isHashChecked = ref(false);
const isExpired = ref(false);
const isCheckFailed = ref(false);
const isResetComplete = ref(false);
const isChangeComplete = ref(false);

const resetForm = reactive<Omit<RecoveryConfirmBody, "hash">>({
  newPassword: "",
  newPasswordConfirm: "",
});

const changeForm = reactive<ChangePasswordBody>({
  password: "",
  newPassword: "",
  newPasswordConfirm: "",
});

const isSubmitting = ref(false);
const passwordError = ref("");
// Which input the message belongs to, so it can be described on that field
// rather than as one sentence at the top of the page.
const errorField = ref<"currentPassword" | "newPassword" | "">("");

// A rejected field arrives as a JSON pointer, e.g. "/newPasswordConfirm".
const rejectedPointer = (error: unknown) =>
  error instanceof ApiClientError
    ? (error.details.errors?.[0]?.source?.pointer ?? "")
    : "";

const canSetPassword = computed(
  () =>
    isHashChecked.value &&
    !isCheckFailed.value &&
    !isExpired.value &&
    !isResetComplete.value,
);

const startSubmit = () => {
  passwordError.value = "";
  errorField.value = "";
  isSubmitting.value = true;
};

const announce = async () => {
  await nextTick();
  heading.value?.focus();
};

const checkHash = async () => {
  if (!hash) return;

  isCheckFailed.value = false;
  isHashChecked.value = false;

  try {
    const { data: recoveryResponse } = await apiClient.invoke(
      "getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired",
      { body: { hash }, fetchOptions: { timeout: 10_000 } },
    );
    // the flag sits inside an array_struct envelope, not on the response root
    isExpired.value = !!recoveryResponse.data?.[0]?.isExpired;
  } catch (error) {
    // Only the API rejecting the hash means the link is dead. A dropped
    // connection or a 5xx says nothing about it, so offer a retry instead.
    if (error instanceof ApiClientError && error.status < 500) {
      isExpired.value = true;
    } else {
      isCheckFailed.value = true;
    }
  } finally {
    isHashChecked.value = true;
  }
};

const requestRecoveryMail = async () => {
  if (isSubmitting.value) return;
  startSubmit();

  try {
    await resetPassword({
      email: email.value,
      // resolved here, because setup also runs on the server, where there is no window
      storefrontUrl: getStorefrontUrl(),
    });
  } catch (error) {
    console.error(error);
  } finally {
    // Unconditional: the acknowledgement must not differ between a known and
    // an unknown address, so it cannot depend on the response.
    isRecoveryRequested.value = true;
    isSubmitting.value = false;
    await announce();
  }
};

const confirmNewPassword = async () => {
  if (!hash || isSubmitting.value) return;
  startSubmit();

  try {
    await apiClient.invoke(
      "recoveryPassword post /account/recovery-password-confirm",
      { body: { hash, ...resetForm } },
    );
    resetForm.newPassword = "";
    resetForm.newPasswordConfirm = "";
    isResetComplete.value = true;
    await announce();
  } catch (error) {
    const pointer = rejectedPointer(error);

    if (pointer.includes("Password")) {
      errorField.value = "newPassword";
      passwordError.value =
        "That password was rejected. Check both fields match and meet the minimum length.";
    } else if (error instanceof ApiClientError) {
      passwordError.value = "This link is no longer valid.";
    } else {
      passwordError.value = "We could not reach the shop. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

const submitPasswordChange = async () => {
  if (isSubmitting.value) return;
  startSubmit();

  try {
    await updatePassword(changeForm);
    changeForm.password = "";
    changeForm.newPassword = "";
    changeForm.newPasswordConfirm = "";
    isChangeComplete.value = true;
    await announce();
  } catch (error) {
    const pointer = rejectedPointer(error);

    if (pointer.includes("password") && !pointer.includes("new")) {
      errorField.value = "currentPassword";
      passwordError.value = "Your current password is not correct.";
    } else if (error instanceof ApiClientError) {
      errorField.value = "newPassword";
      passwordError.value =
        "That password was rejected. Check both fields match and meet the minimum length.";
    } else {
      passwordError.value = "We could not reach the shop. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(checkHash);
</script>

<template>
  <section v-if="hash">
    <h1 ref="heading" tabindex="-1">Choose a new password</h1>

    <!-- the live region is in the page from the start: a node inserted into
         a region that was not already there is not announced -->
    <div aria-live="polite" :aria-busy="!isHashChecked">
      <p v-if="!isHashChecked">Checking the link…</p>

      <p v-else-if="isCheckFailed">
        We could not check this link.
        <button type="button" @click="checkHash">Try again</button>
      </p>

      <p v-else-if="isExpired">
        This link is no longer valid. Request a new recovery mail.
      </p>

      <p v-else-if="isResetComplete">
        Your password was changed. You can sign in with it now.
      </p>
    </div>

    <form v-if="canSetPassword" @submit.prevent="confirmNewPassword">
      <p v-if="passwordError" id="reset-error" role="alert">
        {{ passwordError }}
      </p>

      <label>
        New password
        <input
          v-model="resetForm.newPassword"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="passwordError ? 'reset-error' : undefined"
        />
      </label>

      <label>
        Repeat the new password
        <input
          v-model="resetForm.newPasswordConfirm"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="passwordError ? 'reset-error' : undefined"
        />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Saving…" : "Save the new password" }}
      </button>
    </form>
  </section>

  <section v-else-if="isLoggedIn">
    <h1 ref="heading" tabindex="-1">Change your password</h1>

    <p v-if="isChangeComplete" role="status">Your password was changed.</p>

    <form @submit.prevent="submitPasswordChange">
      <p v-if="passwordError" id="change-error" role="alert">
        {{ passwordError }}
      </p>

      <label>
        Current password
        <input
          v-model="changeForm.password"
          type="password"
          autocomplete="current-password"
          required
          :aria-invalid="errorField === 'currentPassword'"
          :aria-describedby="
            errorField === 'currentPassword' ? 'change-error' : undefined
          "
        />
      </label>

      <label>
        New password
        <input
          v-model="changeForm.newPassword"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="
            errorField === 'newPassword' ? 'change-error' : undefined
          "
        />
      </label>

      <label>
        Repeat the new password
        <input
          v-model="changeForm.newPasswordConfirm"
          type="password"
          autocomplete="new-password"
          required
          :aria-invalid="errorField === 'newPassword'"
          :aria-describedby="
            errorField === 'newPassword' ? 'change-error' : undefined
          "
        />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Saving…" : "Change the password" }}
      </button>
    </form>
  </section>

  <section v-else>
    <h1 ref="heading" tabindex="-1">Forgot your password?</h1>

    <p v-if="isRecoveryRequested" role="status">
      If an account exists for that address, a recovery mail is on its way.
    </p>

    <form v-else @submit.prevent="requestRecoveryMail">
      <label>
        Email
        <input v-model="email" type="email" autocomplete="email" required />
      </label>

      <button type="submit" :aria-disabled="isSubmitting">
        {{ isSubmitting ? "Sending…" : "Send the recovery mail" }}
      </button>
    </form>
  </section>
</template>
