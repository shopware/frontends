<script setup lang="ts">
import { ref, useUser } from "#imports";

const { isLoggedIn } = useUser();
const loginError = ref<string | null>(null);
</script>

<template>
  <div v-if="!isLoggedIn">
    <div v-if="loginError">{{ loginError }}</div>
  </div>
</template>
