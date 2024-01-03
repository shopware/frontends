<script setup lang="ts">
const { count } = useCart();
const { count: wishlistCount } = useWishlist();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const sidebarController = useModal();
</script>

<template>
  <header class="relative bg-white" aria-label="top-navigation">
    <div class="mx-auto px-4 sm:px-6">
      <div
        class="flex items-center border-b-2 border-secondary-100 py-6 space-x-4"
      >
        <div class="flex justify-start items-center min-w-10 lg:min-w-12">
          <div class="order-2 lg:order-1 ml-4 lg:ml-0">
            <NuxtLink :to="formatLink(`/`)">
              <span class="sr-only">Shopware</span>
              <img
                class="h-10 w-10 lg:h-12 lg:w-12"
                src="/logo.svg"
                alt="logo of the shop"
                width="40px"
                height="40px"
              />
            </NuxtLink>
          </div>
          <div class="order-1 lg:order-2 flex justify-start items-center">
            <LayoutSideMenu />
          </div>
        </div>

        <LayoutTopNavigation />
        <div class="flex flex-1"></div>

        <div class="hidden md:flex md:min-w-1/4">
          <LayoutStoreSearch />
        </div>

        <div class="flex items-center justify-end">
          <AccountMenu />
          <div class="flex ml-4 flow-root lg:ml-6">
            <NuxtLink
              class="group -m-2 p-2 flex items-center relative text-center"
              aria-label="wishlist"
              data-testid="wishlist-button"
              :to="formatLink(`/wishlist`)"
            >
              <div
                class="w-7 h-7 i-carbon-favorite text-secondary-600 hover:text-primary hover:animate-count-infinite hover:animate-heart-beat"
              />
              <span
                v-if="wishlistCount > 0"
                class="text-3 font-sm text-white absolute bg-red-600 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
              >
                {{ wishlistCount }}
              </span>
            </NuxtLink>
          </div>
          <!-- Cart -->
          <div class="flex ml-4 flow-root lg:ml-6">
            <button
              class="group bg-transparent -m-2 p-2 flex items-center relative"
              aria-label="Mini cart"
              data-testid="cart-button"
              @click="sidebarController.open"
            >
              <!-- Heroicon name: outline/shopping-bag -->
              <div
                class="w-7 h-7 i-carbon-shopping-bag text-secondary-600 hover:text-primary"
              />
              <span
                v-if="count > 0"
                class="text-3 font-sm text-white absolute bg-primary-600 rounded-full min-w-5 min-h-5 top-0 right-0 leading-5"
              >
                {{ count || "" }}
              </span>
              <span class="sr-only"
                >{{ $t("cart.itemsInCart") }}, {{ $t("cart.viewCart") }}</span
              >
            </button>
          </div>
          <CheckoutSideCart :controller="sidebarController" />
        </div>
      </div>
    </div>
  </header>
</template>
