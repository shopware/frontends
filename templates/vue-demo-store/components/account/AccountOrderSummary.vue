<script lang="ts">
export default {
  name: "AccountOrderSummary",
};
</script>

<template>
  <div class="bg-gray-100 bg-opacity-75 px-2 py-4 flex sm:block gap-10">
    <div
      class="flex flex-col sm:grid grid-cols-5 lg:grid-cols-6 gap-y-5 gap-x-7"
    >
      <div class="lg:col-span-2">Order number</div>
      <div>Total amount</div>
      <div>Order date</div>
      <div>Order status</div>
      <div class="justify-self-end" />
    </div>

    <div
      class="flex flex-col sm:grid grid-cols-5 lg:grid-cols-6 gap-y-5 gap-x-7 text-gray-400"
    >
      <slot />
    </div>
  </div>
</template>
