<script setup lang="ts">
import { useUser } from "#imports";

const { logout, isLoggedIn, user } = useUser();
</script>

<template>
  <div v-if="!isLoggedIn">
    <!-- DISPLAY FORM HERE -->
  </div>
  <div v-else>
    <h1>Hi, {{ user?.firstName }}!</h1>
    <button @click="logout()">sign out</button>
  </div>
</template>
