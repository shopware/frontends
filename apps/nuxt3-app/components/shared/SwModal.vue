<script setup lang="ts">
const isModalOpened = inject("isModalOpened");
</script>

<template>
  <div
    v-if="isModalOpened"
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="isModalOpened = false"
      />
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-500 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div id="modal-content" />
      </div>
    </div>
  </div>
</template>
