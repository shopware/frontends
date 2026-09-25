<script setup lang="ts">
import type { operations } from "#shopware";

const { login, logout, isLoggedIn, user } = useUser();

const credentials = reactive<
  operations["loginCustomer post /account/login"]["body"]
>({
  username: "",
  password: "",
});

const isSubmitting = ref(false);
const loginError = ref("");

const submit = async () => {
  loginError.value = "";
  isSubmitting.value = true;

  try {
    await login(credentials);
  } catch {
    loginError.value = "The email or password is invalid.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form v-if="!isLoggedIn" @submit.prevent="submit">
    <label>
      Email
      <input v-model="credentials.username" type="email" autocomplete="email" />
    </label>

    <label>
      Password
      <input
        v-model="credentials.password"
        type="password"
        autocomplete="current-password"
      />
    </label>

    <p v-if="loginError">{{ loginError }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? "Signing in..." : "Sign in" }}
    </button>
  </form>

  <div v-else>
    <p>Signed in as {{ user?.firstName || user?.email }}</p>
    <button type="button" @click="logout()">Sign out</button>
  </div>
</template>
