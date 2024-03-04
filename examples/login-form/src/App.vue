<script setup lang="ts">
import { useUser } from "@shopware-pwa/composables-next/dist";
import type { ApiError } from "@shopware/api-client";
import { ApiClientError } from "@shopware/api-client";
import { reactive, ref } from "vue";
const { logout, login, isLoggedIn, user } = useUser();
const loginCredentials = reactive({
  username: "",
  password: "",
});
const errors = ref<ApiError[]>([]);
const invokeLogin = async () => {
  try {
    await login(loginCredentials);
  } catch (e) {
    if (e instanceof ApiClientError) {
      errors.value = e.details.errors as ApiError[];
    }
  }
};
</script>
<template>
  <div test-id="test-wrapper">
    <div v-if="!isLoggedIn">
      <h1
        class="text-md font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        Sign in
      </h1>
      <div class="mb-2">
        <label
          for="email"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Your email</label
        >
        <input
          v-model="loginCredentials.username"
          type="email"
          name="email"
          id="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@company.com"
          required="true"
        />
      </div>
      <div>
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Password</label
        >
        <input
          v-model="loginCredentials.password"
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required="true"
        />
      </div>
      <button
        class="bg-sky-400 text-white mt-4 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-sky-500"
        @click="invokeLogin"
      >
        sign in
      </button>
      <div class="notification">
        <div class="errors" v-if="errors && errors?.length > 0">
          {{ errors[0]?.detail }}
        </div>
      </div>
    </div>
    <div v-else>
      <h1>Hi, {{ user?.firstName }}!</h1>
      <button
        class="bg-sky-400 text-white mt-4 w-full font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-sky-500"
        @click="logout()"
      >
        sign out
      </button>
    </div>
  </div>
</template>
<style scoped>
.errors {
  color: red;
  margin-top: 10px;
}
</style>
