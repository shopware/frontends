<script setup lang="ts"></script>

<template>
  <div>
    <SharedModal />
    <LayoutCheckoutHeader />
    <LayoutNotifications />
    <div class="container">
      <slot />
    </div>
    <CheckoutSideCart />
    <LayoutCheckoutFooter />
  </div>
</template>
