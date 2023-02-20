<script setup lang="ts">
import { RouterLink } from "vue-router";

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
        <div class="flex justify-start lg:flex-1 w-full md:w-1/3 lg:w-1/12">
          <div class="order-2 lg:order-1 ml-4 lg:ml-0">
            <RouterLink to="/">
              <span class="sr-only">Shopware</span>
              <img
                class="h-8 w-auto sm:h-10"
                src="/logo.svg"
                alt="Logo"
                width="40px"
                height="40px"
              >
            </RouterLink>
          </div>
          <div class="order-1 lg:order-2 py-3 lg:p-0">
            <LayoutSideMenu />
          </div>
        </div>

        <LayoutTopNavigation />

        <div class="hidden md:block w-full md:w-1/3 lg:w-2/12">
          <LayoutStoreSearch />
        </div>

        <div class="w-full md:w-1/3 lg:w-2/12 flex items-center justify-end">
          <AccountMenu />
          <div class="flex ml-4 flow-root lg:ml-6">
            <button
              class="group -m-2 p-2 flex items-center relative"
              aria-label="wishlist"
              data-testid="wishlist-button"
              @click="$router.push('/wishlist')"
            >
              <div
                class="w-7 h-7 i-carbon-favorite text-gray-600 hover:text-brand-primary"
              />
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
              aria-label="cart"
              data-testid="cart-button"
              @click="isSidebarOpen = true"
            >
              <!-- Heroicon name: outline/shopping-bag -->
              <div
                class="w-7 h-7 i-carbon-shopping-bag text-gray-600 hover:text-brand-primary"
              />
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
  </div>
</template>
