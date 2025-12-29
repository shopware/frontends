<script setup lang="ts">
import type { useRegle } from "@regle/core";

const email = defineModel<string>("email", {
  required: true,
});

const password = defineModel<string>("password", {
  required: true,
});

const { errorMessages } = defineProps<{
  errorMessages?: ReturnType<typeof useRegle>;
}>();

const switchAnimating = ref(false);
const createAccountToggle = ref(false);

function switchAnimation(e: Event) {
  e.preventDefault();

  switchAnimating.value = true;
  setTimeout(() => {
    createAccountToggle.value = true;
    switchAnimating.value = false;
  }, 600);
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
        :label="$t('checkout.customerBaseInfo.emailLabel')"
        :placeholder="$t('checkout.customerBaseInfo.emailPlaceholder')"
        :errorMessage="errorMessages?.value?.email?.$errors?.[0] ?? ''"
      />
      <div
        class="relative transition-all"
        :class="{
          'h-4': !createAccountToggle && !switchAnimating,
          'h-15': switchAnimating || createAccountToggle,
        }"
      >
        <div
          v-if="!createAccountToggle"
          class="flex items-center gap-2 absolute"
          :class="{ 'animate-slide-up-out': switchAnimating }"
        >
          <FormLinkButton class="border-b-0 text-sm" @click="switchAnimation">
            <Icon name="shopware:plus-xs" class="color-brand-primary" />
            <span class="text-brand-primary">{{
              $t("checkout.customerBaseInfo.createAccountToggleLabel")
            }}</span>
          </FormLinkButton>
        </div>
        <div
          v-show="createAccountToggle || switchAnimating"
          class="absolute w-full"
          :class="{
            'opacity-0': !createAccountToggle && switchAnimating,
            'animate-slide-up-in': switchAnimating,
          }"
        >
          <FormInputField
            class="mb-4"
            v-model="password"
            id="password"
            type="password"
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

@keyframes slideUpIn {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up-out {
  animation: slideUpOut 0.6s ease forwards;
}

.animate-slide-up-in {
  animation: slideUpIn 0.6s ease forwards;
}
</style>
