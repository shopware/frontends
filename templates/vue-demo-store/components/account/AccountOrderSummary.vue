<script lang="ts">
export default {
  name: "AccountOrderSummary",
};
</script>

<template>
  <div class="bg-gray-100 bg-opacity-75 px-2 py-4">
    <div class="grid grid-cols-5 gap-y-10 gap-x-6">
      <div class="col-span-2">Order number</div>
      <div>Total amount</div>
      <div>Order date</div>
      <div class="justify-self-end" />
    </div>

    <div class="grid grid-cols-5 gap-y-10 gap-x-6 text-gray-400">
      <slot />
    </div>
  </div>
</template>
