<script setup lang="ts">
import { useRegle } from "@regle/core";

definePageMeta({
  layout: "default",
});

const { t } = useI18n();
const localePath = useLocalePath();
const { formatLink, getStorefrontUrl } = useInternationalization(localePath);
const { resetPassword } = useCustomerPassword();
const { pushError } = useNotifications();

useSeoMeta({
  title: () => t("account.recoverPassword.header"),
});

const state = ref({ email: "" });
const { r$ } = useRegle(state, recoverPasswordFormRules());
const loading = ref(false);
const isRequested = ref(false);
const successMessage = useTemplateRef<HTMLElement>("successMessage");

async function handleSubmit() {
  await r$.$validate();
  if (r$.$invalid) {
    focusFirstInvalid();
    return;
  }

  loading.value = true;
  try {
    await resetPassword({
      email: state.value.email,
      storefrontUrl: getStorefrontUrl(),
    });
    isRequested.value = true;
    // The form that held focus is gone now.
    await nextTick();
    successMessage.value?.focus();
  } catch (error) {
    // From Shopware 6.6.10.3, a known and an unknown address get the same
    // answer, so a failure here is operational. Keep the form for another try.
    console.error("[account/recover]", error);
    pushError(t("account.recoverPassword.errorMessage"));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto px-6 sm:px-4 my-10 md:my-20">
    <div class="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
      <SharedIconBadge icon="i-carbon-email" size="large" />
      <div class="flex flex-col gap-2">
        <h1
          class="text-3xl md:text-4xl font-['Noto_Serif'] leading-tight text-surface-on-surface"
        >
          {{ $t("account.recoverPassword.header") }}
        </h1>
        <p class="text-surface-on-surface-variant">
          {{ $t("account.recoverPassword.subHeader") }}
        </p>
      </div>

      <div
        class="w-full mt-4 p-6 md:p-8 rounded-lg bg-surface-surface-container-low"
      >
        <div aria-live="polite">
          <div
            v-if="isRequested"
            ref="successMessage"
            tabindex="-1"
            class="flex flex-col items-center gap-4 focus:outline-none"
            data-testid="recover-password-success-message"
          >
            <SharedIconBadge icon="i-carbon-checkmark" variant="success" />
            <p class="text-surface-on-surface">
              {{ $t("account.recoverPassword.successMessage") }}
            </p>
          </div>
        </div>

        <form
          v-if="!isRequested"
          class="flex flex-col gap-4 text-left"
          data-testid="recover-password-form"
          @submit.prevent="handleSubmit"
        >
          <FormInputField
            id="email"
            v-model="state.email"
            type="email"
            autocomplete="email"
            :label="$t('form.email')"
            :errorMessage="r$.email.$errors[0]"
            data-testid="recover-password-email-input"
          />
          <FormBaseButton
            type="submit"
            :label="$t('account.recoverPassword.submitButton')"
            :loading="loading"
            data-testid="recover-password-submit-button"
          />
        </form>
      </div>

      <NuxtLink
        :to="formatLink('/account/login')"
        class="mt-2 inline-flex items-center gap-1 text-sm font-medium text-brand-primary hover:underline"
        data-testid="recover-password-login-link"
      >
        <span class="size-4 i-carbon-arrow-left" aria-hidden="true" />
        {{ $t("account.recoverPassword.backToLogin") }}
      </NuxtLink>
    </div>
  </div>
</template>
