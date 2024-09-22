<script setup lang="ts">
const { isLoggedIn } = useUser();
</script>
<template>
  <div>
    isLoggedIn: {{ isLoggedIn }}
    <LoginForm v-if="!isLoggedIn" />
  </div>
</template>
