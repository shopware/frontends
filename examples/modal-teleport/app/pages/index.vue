<script setup lang="ts">
const sharedModal = useTeamModal();
</script>
<template test-id="modal-teleport-example">
  <h2>Home page - example of shared modal</h2>
  <p>
    To see effect of Shared Modal press "Open Team Modal" button and go to Team
    page link. The modal will be opened as soon as you enter the page.
    <br />
    If you go there without clicking the button, the modal will not be opened.
  </p>
  <button
    type="button"
    @click="sharedModal.open"
    class="mx-auto w-full flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
  >
    Open Team Modal when going to Team page
  </button>
</template>
