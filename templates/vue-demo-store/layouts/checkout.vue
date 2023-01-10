<script setup lang="ts"></script>

<template>
  <div>
    <SharedModal />
    <LayoutCheckoutHeader />
    <LayoutNotifications />
    <div class="max-w-screen-xl mx-auto">
      <slot />
    </div>
    <CheckoutSideCart />
  </div>
</template>
