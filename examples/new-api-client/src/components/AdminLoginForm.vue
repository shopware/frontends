<script setup lang="ts">
import { ref } from "vue";
import { login } from "../adminApiClient";

const username = ref("");
const password = ref("");

const invokeLogin = async () => {
  await login({
    password: password.value,
    username: username.value,
  });
};
</script>

<template>
  <form @submit.prevent="invokeLogin">
    <div>
      <label for="username">Username</label>
      <input type="text" id="username" v-model="username" />
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" id="password" v-model="password" />
    </div>
    <div>
      <button type="submit">Login</button>
    </div>
  </form>
</template>
