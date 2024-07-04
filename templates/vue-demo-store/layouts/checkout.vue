<script setup lang="ts">
defineOptions({
  name: "CheckoutLayout",
});
</script>
<template>
  <div>
    <LayoutCheckoutHeader />
    <LayoutNotifications />
    <main class="max-w-screen-xl mx-auto">
      <slot />
    </main>
  </div>
</template>
