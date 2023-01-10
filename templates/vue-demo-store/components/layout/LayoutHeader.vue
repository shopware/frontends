<script setup lang="ts">
const { count } = useCart();
const { count: wishlistCount } = useWishlist();
const isSidebarOpen = inject("isSidebarOpen");
</script>

<template>
  <div class="relative bg-white">
    <div class="mx-auto px-4 sm:px-6">
      <div
        class="flex justify-between items-center border-b-2 border-gray-100 py-6 space-x-4"
      >
        <div class="flex justify-start lg:flex-1 space-x-4 w-20 md:w-1/4 grow">
          <LayoutSideMenu />

          <router-link to="/">
            <span class="sr-only">Shopware</span>
            <img class="h-8 w-auto sm:h-10" src="/logo.svg" alt="Logo" />
          </router-link>
        </div>

        <LayoutTopNavigation />

        <div class="hidden md:block w-full md:w-1/2 lg:w-1/4">
          <LayoutStoreSearch />
        </div>

        <AccountMenu />
        <div class="flex ml-4 flow-root lg:ml-6">
          <button
            class="group -m-2 p-2 flex items-center relative"
            @click="$router.push('/wishlist')"
            data-testid="wishlist-button"
          >
            <div
              class="w-7 h-7 i-carbon-favorite text-gray-600 hover:text-brand-primary"
            ></div>
            <span
              v-if="wishlistCount > 0"
              class="text-3 font-sm text-white absolute bg-red-500 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
            >
              {{ wishlistCount }}
            </span>
          </button>
        </div>
        <!-- Cart -->
        <div class="flex ml-4 flow-root lg:ml-6">
          <button
            class="group -m-2 p-2 flex items-center relative"
            @click="isSidebarOpen = true"
            data-testid="cart-button"
          >
            <!-- Heroicon name: outline/shopping-bag -->
            <div
              class="w-7 h-7 i-carbon-shopping-bag text-gray-600 hover:text-brand-primary"
            ></div>
            <span
              v-if="count > 0"
              class="text-3 font-sm text-white absolute bg-blue rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
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
