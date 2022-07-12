<script setup lang="ts">
const { count } = useCart();
const isSidebarOpen = inject("isSidebarOpen");
</script>

<template>
  <div class="relative bg-white">
    <div class="mx-auto px-4 sm:px-6">
      <div
        class="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10"
      >
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <router-link to="/">
            <span class="sr-only">Shopware</span>
            <img class="h-8 w-auto sm:h-10" src="/logo.svg" alt="" />
          </router-link>
        </div>

        <SwTopNavigation />

        <SwMyAccountMenu />
        <!-- Cart -->
        <div class="hidden md:flex ml-4 flow-root lg:ml-6">
          <button
            class="group -m-2 p-2 flex items-center"
            @click="isSidebarOpen = true"
          >
            <!-- Heroicon name: outline/shopping-bag -->
            <svg
              class="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span
              class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 min-w-30px"
            >
              {{ count || "" }}
            </span>
            <span class="sr-only">items in cart, view bag</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
