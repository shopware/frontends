<script setup lang="ts">
const emits = defineEmits<{
  (e: "success"): void;
  (e: "close"): void;
}>();

const { login, errors, isLoggedIn } = useUser();
const loginErrors = computed(() =>
  errors.login?.map(({ detail }) => detail).toString()
);

const formData = ref({
  username: "",
  password: "",
  remember: true,
});

const invokeLogin = async (): Promise<void> => {
  try {
    const loginResult = await login(formData.value);

    if (loginResult) {
      emits("success");
    }
  } catch (error) {
    console.error("error login", error);
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
        <input v-model="formData.remember" type="hidden" name="remember" />
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
            />
          </div>
        </div>

        <slot :data="formData" />

        <slot name="error">
          <div
            v-if="loginErrors.length"
            class="flex items-center justify-between"
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
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <!-- Heroicon name: solid/lock-closed -->
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            Sign in
          </button>

          <slot name="action" />
        </div>
      </form>
    </div>
    <div v-else>
      <h2>you are logged in</h2>
      <button @click="$emit('close')">close</button>
    </div>
  </div>
</template>
