<script setup lang="ts">
import { ApiClientError } from "@shopware/api-client";
import type { ApiError } from "@shopware/api-client";

const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();
const router = useRouter();
const { isLoggedIn, login } = useUser();
const { t } = useI18n();
const { refreshSessionContext } = useSessionContext();
const { mergeWishlistProducts } = useWishlist();
const { pushSuccess } = useNotifications();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
const loginErrors = ref<string[]>([]);

const formData = ref({
  username: "",
  password: "",
  remember: true,
});

const goToRegister = () => {
  emits("close");
  router.push(formatLink("/register"));
};

const { resolveApiErrors } = useApiErrorsResolver("account_login");

const invokeLogin = async (): Promise<void> => {
  loginErrors.value = [];
  try {
    // TODO: remove this line once the https://github.com/shopware/frontends/issues/112 issue is fixed
    await refreshSessionContext();
    await login(formData.value);
    emits("success");
    pushSuccess(t("account.messages.loggedInSuccess"));
    emits("close");
    mergeWishlistProducts();
  } catch (error) {
    if (error instanceof ApiClientError) {
      loginErrors.value = resolveApiErrors(error.details.errors as ApiError[]);
    }
  }
};

const emailImputElement = ref();
useFocus(emailImputElement, { initialValue: true });
</script>
<template>
  <div
    id="modal-headline"
    role="form"
    title="Login form"
    aria-label="Login form"
    class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div v-if="!isLoggedIn" class="max-w-md w-full space-y-8">
      <div>
        <img
          class="mx-auto h-12 w-auto"
          src="/logo.svg"
          alt="logo of the shop"
        />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-secondary-900">
          {{ $t("account.signInLabel") }}
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
            <label for="email-address" class="sr-only">{{
              $t("form.email")
            }}</label>
            <input
              id="email-address"
              ref="emailImputElement"
              v-model="formData.username"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="$t('form.email')"
              data-testid="login-email-input"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{
              $t("form.password")
            }}</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="$t('form.password')"
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
                class="login-errors text-red-600 focus:ring-indigo-500 border-secondary-300 rounded"
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
              <div class="w-5 h-5 i-carbon-locked" />
            </span>
            {{ $t("account.signIn") }}
          </button>

          <slot name="action">
            <div class="w-full mt-4" @click="$emit('close')">
              <button
                type="button"
                class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                data-testid="login-sign-up-link"
                @click="goToRegister()"
              >
                {{ $t("account.signUp") }}
              </button>
            </div>
          </slot>
        </div>
      </form>
    </div>
    <div v-else>
      <h2>{{ $t("account.loggedInInfo") }}</h2>
      <button
        class="group relative w-full flex justify-center py-2 px-4 mb-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @click="$emit('close')"
      >
        close
      </button>
    </div>
  </div>
</template>
