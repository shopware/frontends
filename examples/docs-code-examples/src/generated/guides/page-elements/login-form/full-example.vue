<script setup lang="ts">
import { reactive, ref, useUser } from "#imports";

const { logout, login, isLoggedIn, user } = useUser();
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
  <div v-if="!isLoggedIn">
    <h1>Sign in to your account</h1>
    <input type="text" v-model="loginCredentials.username" />
    <input type="password" v-model="loginCredentials.password" />
    <button @click="invokeLogin">sign in</button>
    <div v-if="loginError" class="errors">{{ loginError }}</div>
  </div>
  <div v-else>
    <h1>Hi, {{ user?.firstName }}!</h1>
    <button @click="logout()">sign out</button>
  </div>
</template>
<style scoped>
.errors {
  color: red;
  margin-top: 10px;
}
</style>
