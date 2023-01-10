<script setup lang="ts">
import { ClientApiError } from "@shopware-pwa/types";

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const { isLoggedIn, login } = useUser();
const { mergeWishlistProducts } = useWishlist();
const { pushSuccess } = useNotifications();
const loginErrors = ref<string[]>([]);

const formData = ref({
  username: "",
  password: "",
  remember: true,
});

const invokeLogin = async (): Promise<void> => {
  loginErrors.value = [];
  try {
    await login(formData.value);
    emits("success");
    pushSuccess("You are logged in");
    emits("close");
    mergeWishlistProducts();
  } catch (error) {
    const e = error as ClientApiError;
    loginErrors.value = e.messages.map(({ detail }) => detail);
  }
};
</script>
<template>
  <div
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div v-if="!isLoggedIn" class="max-w-md w-full space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="/logo.svg" alt="Logo" />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="invokeLogin">
        <input
          v-model="formData.remember"
          type="hidden"
          name="remember"
          data-testid="login-remember-input"
        />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="formData.username"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              data-testid="login-email-input"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              data-testid="login-password-input"
            />
          </div>
        </div>

        <slot :data="formData" />

        <slot name="error">
          <div
            v-if="loginErrors.length"
            class="flex items-center justify-between"
            data-testid="login-errors-container"
          >
            <div class="flex items-center">
              <div
                class="login-errors text-red-600 focus:ring-indigo-500 border-gray-300 rounded"
              >
                {{ loginErrors }}
              </div>
            </div>
          </div>
        </slot>

        <div>
          <button
            class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="submit"
            data-testid="login-submit-button"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="w-5 h-5 i-carbon-locked"></div>
            </span>
            Sign in
          </button>

          <slot name="action">
            <div @click="$emit('close')">
              <nuxt-link
                to="/register"
                class="w-full flex justify-center py-2 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-testid="login-sign-up-link"
              >
                Sign up
              </nuxt-link>
            </div>
          </slot>
        </div>
      </form>
    </div>
    <div v-else>
      <h2>you are logged in</h2>
      <button @click="$emit('close')">close</button>
    </div>
  </div>
</template>
