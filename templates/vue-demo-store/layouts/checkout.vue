<script setup lang="ts"></script>

<template>
  <div data-testid="checkout-layout">
    <LayoutCheckoutHeader />
    <LayoutNotifications />
    <div class="max-w-screen-xl mx-auto">
      <slot />
    </div>
  </div>
</template>
