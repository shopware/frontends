<template>
  <header class="sticky top-0 z-50 w-full border-b  border-outline-outline-variant bg-surface-surface">
    <div class="container flex h-20 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto ">
      <!-- Logo and Brand -->
      <div class="flex items-center gap-2">
      <div class="justify-start text-brand-primary text-5xl font-light font-['Noto_Serif'] leading-[76.50px]">CF</div>
      <div class="ml-2 hidden md:block">
        <div class="text-[length:var(--font-size-scale-01)] text-surface-on-surface-variant font-light font-['Archivo']">Composable</div>
        <div class="text-[length:var(--font-size-scale-02)] text-surface-on-surface font-light font-['Archivo']">Frontends</div>
      </div>

      </div>
      <!-- Search Bar -->
      <div class="relative w-full max-w-sm mx-4">
        <input type="search" placeholder="Search"
          class="w-full rounded-md border border-outline-outline-variant pl-3 pr-10 py-2 focus:outline-none focus:border-outline-outline-focus" />
        <button class="absolute right-0 top-0 h-full px-3 text-outline-outline bg-transparent">
          <SearchIcon class="h-4 w-4" />
          <span class="sr-only">Search</span>
        </button>
      </div>

      <!-- Action Icons -->
      <div class="flex items-center gap-2">
        <button class="p-2 text-brand-primary bg-transparent transition-transform duration-300 hover:scale-120">
          <UserIcon class="h-5 w-5" />
          <span class="sr-only">Account</span>
        </button>

        <button
          class="p-2 text-brand-primary relative bg-transparent transition-transform duration-300 hover:scale-120">
          <HeartIcon class="h-5 w-5" />
          <span class="sr-only">Favorites</span>
          <span
            class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d12d24] text-[length:var(--font-size-scale-01)] font-medium text-surface-surface">
            2
          </span>
        </button>

        <button class="p-2 text-brand-primary bg-transparent transition-transform duration-300 hover:scale-120">
          <ShoppingCartIcon class="h-5 w-5" />
          <span class="sr-only">Cart</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import {
  HeartIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-vue-next";
</script>

<style scoped>
/* Component-specific styles */
</style>