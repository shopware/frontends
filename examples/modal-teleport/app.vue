<script setup lang="ts">
const visible = ref<boolean>(false);
const modalHandler = {
  open: () => {
    visible.value = true;
  },
  close: () => {
    visible.value = false;
  },
};

provide("modal", { visible, ...modalHandler });
</script>

<template>
  <NuxtLayout />
  <Modal/>
</template>
