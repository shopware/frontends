<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useUser } from "@shopware-pwa/composables-next";

const emits = defineEmits<{
  (e: "success"): void;
}>();

const { login } = useUser();

const username = ref("");
const password = ref("");
const isLoggedIn = ref(false);

const loginAction = async () => {
  await login({
    username: username.value,
    password: password.value,
  });
  isLoggedIn.value = true;
  emits("success");
};
</script>
<template>
  <div>
    <p class="mb-2">Please login to use example:</p>
    <form class="flex flex-col gap-4" @submit.prevent="loginAction">
      <input class="border" type="text" v-model="username" />
      <input class="border" type="password" v-model="password" />
      <button type="submit">Login</button>
    </form>
  </div>
</template>
