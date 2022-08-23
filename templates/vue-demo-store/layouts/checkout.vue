<script lang="ts">
export default {
  name: "CheckoutLayout",
};
</script>
<template>
  <div>
    <SwModal />
    <SwHeader />
    <LayoutNotifications />
    <div class="max-w-screen-xl mx-auto">
      <slot />
    </div>
    <CheckoutSideCart />
  </div>
</template>
