<script lang="ts" setup>
const { count: cartCount } = useCart();
const { count: wishlistCount } = useWishlist();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <div class="border-b">
    <div class="container mx-auto flex items-center justify-between py-3.5">
      <NuxtLink :to="formatLink('/')">
        <NuxtImg class="h-20 max-sm:h-10" src="/logo.svg"  alt="logo"/>
      </NuxtLink>
      <LayoutHeaderSearch class="max-sm:hidden" />
      <div class="flex gap-4">
        <LayoutHeaderSearchIcon class="hidden max-sm:block" />
        <LayoutHeaderMyAccountIcon />
        <LayoutHeaderWishlistIcon :counter="wishlistCount" />
        <LayoutHeaderCartIcon :counter="cartCount" />
      </div>
    </div>
  </div>
</template>
