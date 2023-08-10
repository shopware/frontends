<script setup lang="ts">
import Frontends from "../components/Frontends.vue";
</script>

<template>
  <div id="app">
    <Frontends template="Blank Vue 3 template (Nuxt)" />
    <NuxtLink to="storyblok/home">Storyblok Home</NuxtLink>
  </div>
</template>
<style>
@import "../style.css";
</style>
