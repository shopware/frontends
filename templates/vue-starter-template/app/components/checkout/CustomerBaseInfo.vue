<script setup lang="ts">
import type { Regle } from "@regle/core";

import type { FocusableInput } from "#imports";

const email = defineModel<string>("email", {
  required: true,
});

const password = defineModel<string>("password", {
  required: true,
});

const createAccount = defineModel<boolean>("createAccount", {
  required: true,
});

const { validation } = defineProps<{
  validation?: Regle<{
    email: string;
    password: string;
  }>["r$"];
}>();

const passwordField = useTemplateRef<FocusableInput>("passwordField");

async function switchToAccount() {
  if (createAccount.value) return;

  createAccount.value = true;
  await nextTick();
  passwordField.value?.focus({ preventScroll: true });
}

function switchToGuest() {
  if (!createAccount.value) return;
  createAccount.value = false;
}
</script>
<template>
  <div>
    <FormInputField
      class="mb-4"
      v-model="email"
      id="email"
      type="email"
      autocomplete="email"
      data-testid="checkout-pi-email-input"
      :label="$t('checkout.customerBaseInfo.emailLabel')"
      :placeholder="$t('checkout.customerBaseInfo.emailPlaceholder')"
      :errorMessage="validation?.email.$errors[0]"
      @blur="validation?.email.$touch()"
    />
    <div v-if="!createAccount" class="mb-4">
      <FormLinkButton
        class="border-b-0 text-sm"
        data-testid="checkout-create-account-toggle"
        @click="switchToAccount"
      >
        <Icon name="shopware:plus-xs" class="color-brand-primary" />
        <span class="text-brand-primary">{{
          $t("checkout.customerBaseInfo.createAccountToggleLabel")
        }}</span>
      </FormLinkButton>
    </div>
    <div v-else class="mb-4">
      <FormInputField
        ref="passwordField"
        class="mb-2"
        v-model="password"
        id="password"
        type="password"
        autocomplete="new-password"
        data-testid="checkout-pi-password-input"
        :label="$t('checkout.customerBaseInfo.passwordLabel')"
        :placeholder="$t('checkout.customerBaseInfo.passwordPlaceholder')"
        :errorMessage="validation?.password.$errors[0]"
        @blur="validation?.password.$touch()"
      />
      <FormLinkButton class="border-b-0 text-sm" @click="switchToGuest">
        <span class="text-brand-primary">{{
          $t("checkout.customerBaseInfo.continueAsGuestToggleLabel")
        }}</span>
      </FormLinkButton>
    </div>
  </div>
</template>
