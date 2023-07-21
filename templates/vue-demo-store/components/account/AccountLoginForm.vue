<script setup lang="ts">
import { ClientApiError } from "@shopware-pwa/types";
import {
  XMarkIcon,
} from '@heroicons/vue/24/solid';
import { SharedModal } from "../shared/SharedModal.vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();
const modal = inject<SharedModal>("modal") as SharedModal;
const { login } = useUser();
const loading = ref();
const { mergeWishlistProducts } = useWishlist();
const { pushSuccess, pushError } = useNotifications();


const rules = computed(() => ({
  username: {
    required,
  },
  password: {
    required,
  },
}));

const formData = ref({
  username: "",
  password: "",
  remember: true,
});

const $v = useVuelidate(rules, formData);

const invokeLogin = async (): Promise<void> => {
  $v.value.$touch();
  const valid = await $v.value.$validate();
  if (valid) {
    loading.value = true;
    try {
      await login(formData.value);
      emits("success");
      pushSuccess("You are logged in");
      emits("close");
      mergeWishlistProducts();
    } catch (error) {
      const e = error as ClientApiError;
      const loginErrors = e.messages.map(({ detail }) => detail);
      pushError(loginErrors?.[0]);
    } finally {
      loading.value = false;
    }
  }
};

const openSignUp = () => {
  emits("close");
  setTimeout(() => {
    modal.open('AccountSignUpForm', {
      position: 'side'
    })
  }, 300);
}

const openForgotPassword = () => {
  emits("close");
  setTimeout(() => {
    modal.open('AccountRecoverPassword', {
      position: 'side'
    })
  }, 300);
}
</script>
<template>
  <div class="w-full pointer-events-auto h-full">
    <div class="flex h-full w-full flex-col bg-white shadow-xl p-6">
      <div class="flex flex-col h-full">
        <div class="flex items-start justify-between mb-6">
          <h2
            id="slide-over-title"
            class="text-lg capitalize font-medium text-gray-900 py-0"
          >
            {{ $t('login') }}
          </h2>
          <div class="ml-3 flex h-7 items-center">
            <button
              type="button"
              class="-m-2 p-2 text-gray-700"
              @click="emits('close')"
            >
              <span class="sr-only">Close panel</span>
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="flex-1 min-h-0">
          <form class="flex-1 min-h-0 flex flex-col gap-6" @submit.prevent="invokeLogin">
            <p>{{ $t('log_in_with_your_email_and_password') }}</p>
            <div>
              <label
                :class="{
                  'text-red-600': $v.username.$error
                }"
                class="text-sm font-medium text-gray-700 mb-1" for="email">{{ $t('email_address') }}</label>
              <input
                v-model="formData.username"
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                :class="{
                  'border-red-600': $v.username.$error
                }"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              />
              <span
                v-if="$v.username.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.username.$errors[0].$params as any).type}`, $v.username.$errors[0].$params as any) }}
              </span>
            </div>
            <div>
              <label
                :class="{
                  'text-red-600': $v.password.$error
                }"
                class="capitalize text-sm font-medium text-gray-700 mb-1" for="password">{{ $t('password') }}</label>
              <input
                v-model="formData.password"
                id="password"
                name="password"
                type="password"
                autocomplete="password"
                :class="{
                  'border-red-600': $v.password.$error
                }"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm"
              />
              <span
                v-if="$v.password.$error"
                class="text-red-600 text-sm focus:ring-brand-primary border-gray-300 rounded"
              >
                {{ $t(`validation.${($v.password.$errors[0].$params as any).type}`, $v.password.$errors[0].$params as any) }}
              </span>
            </div>
            <div class="flex justify-between">
              <SharedCheckbox
                :content="$t('remember_me')"
                v-model="formData.remember"
              />
              <nuxt-link class="font-medium text-sm cursor-pointer" @click="openForgotPassword">{{ $t('forgot_password') }}</nuxt-link>
            </div>
            <button
              type="submit"
              class="flex capitalize items-center justify-center px-5 py-2 text-base font-medium text-white shadow-sm bg-gray-800 disabled:opacity-50"
              :disabled="loading"
            >
              {{ $t('login') }}
            </button>
          </form>
          <div class="text-center flex flex-col mt-10 gap-4">
            <p class="font-medium text-lg">{{ $t('do_not_have_an_account_yet') }}</p>
            <button
              type="button"
              class="flex capitalize items-center justify-center px-5 py-2 text-base font-medium text-gray-700 shadow-sm border border-gray-300 bg-white"
              @click="openSignUp"
            >
              {{ $t('signup') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
