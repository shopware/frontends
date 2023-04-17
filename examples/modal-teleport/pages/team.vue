<script setup lang="ts">
import { SharedModal } from "~~/components/Modal.vue";
const modal = inject<SharedModal>("modal") as SharedModal;
</script>
<template>
  <h2>Team page</h2>
  <button
    type="button"
    @click="modal.open()"
    class="mx-auto w-full flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
  >
    Open Modal
  </button>
  <ClientOnly>
    <Teleport to="#modal-content" :disabled="!modal.visible">
      <p>Hello from the team page!</p>
    </Teleport>
  </ClientOnly>
</template>
