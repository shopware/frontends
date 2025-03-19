<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white">
    <div class="container flex h-16 items-center justify-between px-4 md:px-6">
      <!-- Logo and Brand -->
      <div class="flex items-center gap-2">
        <a href="/" class="flex items-center">
          <span class="text-2xl font-bold text-[#543b95]">CF</span>
          <div class="ml-2 hidden md:block">
            <div class="text-xs text-[#696470]">Composable</div>
            <div class="text-sm font-medium text-[#1d1b20]">Frontends</div>
          </div>
        </a>
      </div>
      
      <!-- Search Bar -->
      <div class="relative w-full max-w-sm mx-4">
        <input
          type="search"
          placeholder="Search"
          class="w-full rounded-md border border-[#cac4d0] pl-3 pr-10 py-2 focus:outline-none"
        />
        <button 
          class="absolute right-0 top-0 h-full px-3 text-[#758ca3] bg-transparent"
        >
          <SearchIcon class="h-4 w-4" />
          <span class="sr-only">Search</span>
        </button>
      </div>
      
      <!-- Action Icons -->
      <div class="flex items-center gap-2">
        <button class="p-2 text-[#543b95]">
          <UserIcon class="h-5 w-5" />
          <span class="sr-only">Account</span>
        </button>
        
        <button class="p-2 text-[#543b95] relative">
          <HeartIcon class="h-5 w-5" />
          <span class="sr-only">Favorites</span>
          <span class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d12d24] text-[10px] font-medium text-white">
            2
          </span>
        </button>
        
        <button class="p-2 text-[#543b95]">
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
