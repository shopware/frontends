<script setup lang="ts">
import { reactive, ref, useUser } from "#imports";

const {
  login, // login method, accepts username and password
  logout, // performing a logout
  isLoggedIn, // flag that says if customer is logged in
  user, // the whole customer object
} = useUser();

const loginCredentials = reactive({
  username: "",
  password: "",
});
const loginError = ref<string | null>(null);

const invokeLogin = async () => {
  loginError.value = null;
  try {
    await login(loginCredentials);
  } catch (error) {
    loginError.value = error instanceof Error ? error.message : "Login failed";
  }
};
</script>

<template>
  <button v-if="!isLoggedIn" @click="invokeLogin">sign in</button>
  <button v-else @click="logout()">sign out {{ user?.firstName }}</button>
  <p v-if="loginError">{{ loginError }}</p>
</template>
