<script setup lang="ts">
import { useRegle } from "@regle/core";
import { ApiClientError } from "@shopware/api-client";

// Shopware links here from the recovery mail: /account/recover/password?hash=...
definePageMeta({
  layout: "default",
});

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const { apiClient } = useShopwareContext();
const { handleApiError } = useApiErrorsResolver("account_reset_password_form");

useSeoMeta({
  title: () => t("account.resetPassword.header"),
});

const hash = route.query.hash?.toString() ?? "";

const state = ref<ResetPasswordFormState>({
  newPassword: "",
  newPasswordConfirm: "",
});
const { r$ } = useRegle(state, resetPasswordFormRules(state));

const linkStatus = ref<"checking" | "valid" | "expired" | "unknown">(
  "checking",
);
const loading = ref(false);
const isResetComplete = ref(false);

async function checkLink() {
  if (!hash) {
    linkStatus.value = "expired";
    return;
  }

  linkStatus.value = "checking";
  try {
    const { data } = await apiClient.invoke(
      "getCustomerRecoveryIsExpired post /account/customer-recovery-is-expired",
      { body: { hash } },
    );
    linkStatus.value = data.data?.[0]?.isExpired ? "expired" : "valid";
  } catch (error) {
    // Shopware rejects a malformed hash with 400 and an unknown one with 404.
    // Anything else, such as a rate limit or a dropped connection, says
    // nothing about the link.
    linkStatus.value =
      error instanceof ApiClientError && [400, 404].includes(error.status)
        ? "expired"
        : "unknown";
  }
}

async function handleSubmit() {
  await r$.$validate();
  if (r$.$invalid) {
    return;
  }

  loading.value = true;
  try {
    await apiClient.invoke(
      "recoveryPassword post /account/recovery-password-confirm",
      { body: { hash, ...state.value } },
    );
    state.value.newPassword = "";
    state.value.newPasswordConfirm = "";
    isResetComplete.value = true;
  } catch (error) {
    handleApiError(error);
  } finally {
    loading.value = false;
  }
}

onMounted(checkLink);
</script>

<template>
  <div class="container mx-auto px-6 sm:px-4 my-10 md:my-20">
    <div class="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
      <SharedIconBadge icon="i-carbon-password" size="large" />
      <div class="flex flex-col gap-2">
        <h1
          class="text-3xl md:text-4xl font-['Noto_Serif'] leading-tight text-surface-on-surface"
        >
          {{ $t("account.resetPassword.header") }}
        </h1>
        <p class="text-surface-on-surface-variant">
          {{ $t("account.resetPassword.subHeader") }}
        </p>
      </div>

      <div
        class="w-full mt-4 p-6 md:p-8 rounded-lg bg-surface-surface-container-low"
      >
        <div aria-live="polite" :aria-busy="linkStatus === 'checking'">
          <p
            v-if="linkStatus === 'checking'"
            class="flex items-center justify-center gap-3 text-surface-on-surface-variant"
          >
            {{ $t("account.resetPassword.checkingLink") }}
            <span
              class="size-5 i-carbon-circle-dash animate-spin animate-count-infinite animate-duration-2000 text-brand-primary"
              aria-hidden="true"
            />
          </p>

          <div
            v-else-if="linkStatus === 'unknown'"
            class="flex flex-col items-center gap-4"
          >
            <SharedIconBadge icon="i-carbon-cloud-offline" variant="error" />
            <p class="text-surface-on-surface">
              {{ $t("account.resetPassword.checkFailed") }}
            </p>
            <FormBaseButton
              variant="outline"
              :label="$t('account.resetPassword.retryButton')"
              data-testid="reset-password-retry-button"
              @click="checkLink"
            />
          </div>

          <div
            v-else-if="linkStatus === 'expired'"
            class="flex flex-col items-center gap-4"
            data-testid="reset-password-expired-message"
          >
            <SharedIconBadge icon="i-carbon-time" variant="error" />
            <p class="text-surface-on-surface">
              {{ $t("account.resetPassword.linkExpired") }}
            </p>
            <NuxtLink
              :to="formatLink('/account/recover')"
              class="px-4 py-3 rounded bg-brand-primary text-brand-on-primary font-bold leading-normal inline-flex items-center justify-center hover:bg-brand-primary-hover transition-colors"
              data-testid="reset-password-recover-link"
            >
              {{ $t("account.resetPassword.requestNewLink") }}
            </NuxtLink>
          </div>

          <div
            v-else-if="isResetComplete"
            class="flex flex-col items-center gap-4"
            data-testid="reset-password-success-message"
          >
            <SharedIconBadge icon="i-carbon-checkmark" variant="success" />
            <p class="text-surface-on-surface">
              {{ $t("account.resetPassword.successMessage") }}
            </p>
            <NuxtLink
              :to="formatLink('/account/login')"
              class="px-4 py-3 rounded bg-brand-primary text-brand-on-primary font-bold leading-normal inline-flex items-center justify-center hover:bg-brand-primary-hover transition-colors"
              data-testid="reset-password-login-link"
            >
              {{ $t("account.resetPassword.goToLogin") }}
            </NuxtLink>
          </div>
        </div>

        <form
          v-if="linkStatus === 'valid' && !isResetComplete"
          class="flex flex-col gap-4 text-left"
          data-testid="reset-password-form"
          @submit.prevent="handleSubmit"
        >
          <FormInputField
            id="newPassword"
            v-model="state.newPassword"
            type="password"
            autocomplete="new-password"
            :label="$t('account.resetPassword.newPasswordLabel')"
            :errorMessage="r$.newPassword.$errors[0]"
            data-testid="reset-password-new-password-input"
          />
          <FormInputField
            id="newPasswordConfirm"
            v-model="state.newPasswordConfirm"
            type="password"
            autocomplete="new-password"
            :label="$t('account.resetPassword.confirmPasswordLabel')"
            :errorMessage="r$.newPasswordConfirm.$errors[0]"
            data-testid="reset-password-confirm-password-input"
          />
          <FormBaseButton
            type="submit"
            :label="$t('account.resetPassword.submitButton')"
            :loading="loading"
            data-testid="reset-password-submit-button"
          />
        </form>
      </div>
    </div>
  </div>
</template>
