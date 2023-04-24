<script setup lang="ts">
const sharedModal = useTeamModal();
</script>
<template>
  <h2>Team page</h2>
  <p>
    Here we use shared modal that we created. It is controlled by the
    useTeamModal composable, so can be fired anywhere you need.
    <br />
    In this case if you pressed that button on Homepage you'll see opened dialog
    entering this page. Otherwise you can open it by clicking the button below.
  </p>
  <button
    type="button"
    @click="sharedModal.open"
    class="mx-auto w-full flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
  >
    Open Team Modal
  </button>
  <AppModal :controller="sharedModal">
    <p>Hello from the team page!</p>
  </AppModal>
</template>
