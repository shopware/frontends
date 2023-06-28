<script setup lang="ts">
import { ref } from "vue";
import { apiClient } from "../apiClient";

const username = ref("");
const password = ref("");

const login = async () => {
  const session = await apiClient.invoke("loginCustomer post /account/login", {
    username: username.value,
    password: password.value,
  });
  console.log(session);
};
</script>

<template>
  <form @submit.prevent="login">
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
