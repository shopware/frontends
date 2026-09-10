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

const switchAnimating = ref(false);
let switchAnimationTimer: ReturnType<typeof setTimeout> | undefined;

const passwordField = useTemplateRef<FocusableInput>("passwordField");

async function switchAnimation() {
  if (switchAnimating.value || createAccount.value) return;

  createAccount.value = true;
  switchAnimating.value = true;

  // `v-show` on the password field tracks `createAccount`, so the input is
  // focusable as soon as this flag flushes. Focus it now rather than when the
  // animation ends: a delayed focus would pull the caret out of whatever the
  // user moved to during those 600ms.
  await nextTick();
  passwordField.value?.focus({ preventScroll: true });

  switchAnimationTimer = setTimeout(() => {
    switchAnimating.value = false;
  }, SWITCH_ANIMATION_MS);
}

// The checkout content sits behind a `v-if`/`v-else` on the empty cart, so this
// component can be destroyed mid-animation.
onUnmounted(() => clearTimeout(switchAnimationTimer));
</script>
<template>
  <form @submit.prevent>
    <div>
      <FormInputField
        class="mb-4"
        v-model="email"
        id="email"
        autocomplete="email"
        :label="$t('checkout.customerBaseInfo.emailLabel')"
        :placeholder="$t('checkout.customerBaseInfo.emailPlaceholder')"
        :errorMessage="errorMessages?.value?.email?.$errors?.[0] ?? ''"
      />
      <div
        class="relative transition-all"
        :class="{
          'h-4': !createAccount,
          'h-15': createAccount,
        }"
      >
        <div
          v-if="!createAccount || switchAnimating"
          class="flex items-center gap-2 absolute"
          :class="{ 'animate-slide-up-out': switchAnimating }"
          :inert="switchAnimating || undefined"
        >
          <FormLinkButton class="border-b-0 text-sm" @click="switchAnimation">
            <Icon name="shopware:plus-xs" class="color-brand-primary" />
            <span class="text-brand-primary">{{
              $t("checkout.customerBaseInfo.createAccountToggleLabel")
            }}</span>
          </FormLinkButton>
        </div>
        <div
          v-show="createAccount"
          class="absolute w-full"
          :class="{ 'animate-fade-in': switchAnimating }"
        >
          <FormInputField
            ref="passwordField"
            class="mb-4"
            v-model="password"
            id="password"
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
