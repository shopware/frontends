<script setup lang="ts">
const _modal1 = useModal();
const modal2 = useModal();

// You can overwrite default modal behaviour in two ways:
const modal1 = {
  ..._modal1,
  close: () => {
    _modal1.close();
    modal2.open();
  },
};

// the same as:
// watch(modal1.isOpen, (isOpen) => {
//   if (!isOpen) {
//     modal2.open();
//   }
// });
</script>
<template>
  <h2>Wishlist page</h2>
  <p>
    here there is example of simple modals. You can open each of them
    separately, you can also define some action, like closing the first modal
    will open the second one.
  </p>
  <button
    type="button"
    @click="modal1.open"
    class="mx-auto w-full flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
  >
    Open Modal
  </button>
  <button
    type="button"
    @click="modal2.open()"
    class="mx-auto w-full flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
  >
    Open Second page Modal
  </button>
  <AppModal :controller="modal1">
    <p>Hello from the wishlist page!</p>
    <p>Closing this modal will open another one.</p>
  </AppModal>
  <AppModal :controller="modal2">
    <p>This is another modal on the same page</p>
  </AppModal>
</template>
