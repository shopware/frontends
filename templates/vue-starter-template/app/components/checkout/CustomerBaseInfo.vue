<script setup lang="ts">
import type { Regle } from "@regle/core";

import type { FocusableInput } from "#imports";

const email = defineModel<string>("email", {
  required: true,
});

const password = defineModel<string>("password", {
  required: true,
});

const { errorMessages } = defineProps<{
  errorMessages?: Ref<
    Regle<{
      email: string;
      password: string;
    }>["r$"]
  >;
}>();

const SWITCH_ANIMATION_MS = 600;
const switchAnimationDuration = `${SWITCH_ANIMATION_MS}ms`;

// The checkout page decides guest vs account, so it owns this.
const createAccount = defineModel<boolean>("createAccount", {
  default: false,
});

const switchAnimating = ref(false);

const passwordField = useTemplateRef<FocusableInput>("passwordField");

async function switchAnimation() {
  if (switchAnimating.value || createAccount.value) return;

  // On the click, not when the animation ends: a fast submit registered a guest.
  createAccount.value = true;
  switchAnimating.value = true;

  // `v-show` on the password field tracks `switchAnimating`, so the input is
  // focusable as soon as this flag flushes. Focus it now rather than when the
  // animation ends: a delayed focus would pull the caret out of whatever the
  // user moved to during those 600ms.
  await nextTick();
  passwordField.value?.focus({ preventScroll: true });

  setTimeout(() => {
    switchAnimating.value = false;
  }, SWITCH_ANIMATION_MS);
}

function handleUpdateBaseInfo() {
  console.log("handle data update");
}
</script>
<template>
  <form @submit.prevent="handleUpdateBaseInfo">
    <div>
      <FormInputField
        class="mb-4"
        v-model="email"
        id="email"
        data-testid="checkout-pi-email-input"
        autocomplete="email"
        :label="$t('checkout.customerBaseInfo.emailLabel')"
        :placeholder="$t('checkout.customerBaseInfo.emailPlaceholder')"
        :errorMessage="errorMessages?.value?.email?.$errors?.[0] ?? ''"
      />
      <div
        class="relative transition-all"
        :class="{
          'h-4': !createAccount && !switchAnimating,
          'h-15': switchAnimating || createAccount,
        }"
      >
        <div
          v-if="!createAccount || switchAnimating"
          class="flex items-center gap-2 absolute"
          :class="{ 'animate-slide-up-out': switchAnimating }"
        >
          <FormLinkButton
            class="border-b-0 text-sm"
            data-testid="checkout-create-account-toggle"
            @click="switchAnimation"
          >
            <Icon name="shopware:plus-xs" class="color-brand-primary" />
            <span class="text-brand-primary">{{
              $t("checkout.customerBaseInfo.createAccountToggleLabel")
            }}</span>
          </FormLinkButton>
        </div>
        <div
          v-show="createAccount || switchAnimating"
          class="absolute w-full"
          :class="{ 'animate-fade-in': switchAnimating }"
        >
          <FormInputField
            ref="passwordField"
            class="mb-4"
            v-model="password"
            id="password"
            data-testid="checkout-pi-password-input"
            type="password"
            autocomplete="new-password"
            :label="$t('checkout.customerBaseInfo.passwordLabel')"
            :placeholder="$t('checkout.customerBaseInfo.passwordPlaceholder')"
            :errorMessage="errorMessages?.value?.password?.$errors?.[0] ?? ''"
          />
        </div>
      </div>
    </div>
  </form>
</template>
<style scoped>
@keyframes slideUpOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-100%);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-slide-up-out {
  animation: slideUpOut v-bind(switchAnimationDuration) ease forwards;
}

.animate-fade-in {
  animation: fadeIn 150ms ease forwards;
}
</style>
