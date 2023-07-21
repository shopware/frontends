<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  HeartIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline';
import { SharedModal } from "../shared/SharedModal.vue";

const { count } = useCart();
const { count: wishlistCount } = useWishlist();
const isSidebarOpen = inject("isSidebarOpen");
const headerMode = useState<'default' | 'transparent'>('headerMode', () => 'default');
const { locale } = useI18n({ useScope: 'global' });
const { currentLanguage, syncLanguageData } = useLanguage();
const modal = inject<SharedModal>("modal") as SharedModal;

const openWishlist = () => {
  modal.open('LayoutFlyoutWistlist', {
    position: 'side'
  })
}
</script>

<template>
  <header :class="{
    'z-40 transition': true,
    'text-white bg-transparent fixed w-full header-transparent': headerMode === 'transparent',
    'sticky top-0 md:-top-8 relative bg-white border-b-2 border-gray-100 text-gray-700 header-default': headerMode === 'default',
  }">
    <nav aria-label="Global">
      <!-- For Desktop -->
      <div class="header-desktop hidden lg:block container mx-auto">
        <div class="flex justify-end gap-4 pt-2 mb-4">
          <LayoutCurrency />
          <LayoutLanguage />
        </div>
        <div
          class="flex justify-between items-center pb-3 space-x-4"
        >
          <div class="flex-[2_2_0%]">
            <LayoutTopNavigation />
          </div>
          <div class="flex-1 flex justify-center">
            <div>
              <RouterLink to="/" class="text-current">
                <span class="sr-only">LUXED</span>
                <div :class="[
                    'w-40 h-5 i-custom:logo',
                    headerMode === 'transparent' ? 'text-white' : 'text-black'
                  ]"
                />
              </RouterLink>
            </div>
          </div>

          <div class="flex-[2_2_0%] flex gap-6 items-center justify-end">
            <LayoutStoreSearch />
            <div class="flex gap-4">
              <AccountMenu />
              <div class="flex flow-root">
                <button
                  class="group -m-2 p-2 flex items-center relative"
                  aria-label="wishlist"
                  data-testid="wishlist-button"
                  @click="openWishlist"
                >
                  <HeartIcon
                    class="w-6 h-6 text-current"
                  />
                  <span
                    v-if="wishlistCount > 0"
                    class="text-[10px] font-medium text-white absolute bg-gray-900 rounded-full w-5 h-5 top-0 right-0 leading-5"
                  >
                    {{ wishlistCount }}
                  </span>
                </button>
              </div>
              <!-- Cart -->
              <div class="flex flow-root">
                <button
                  class="group -m-2 p-2 flex items-center relative"
                  aria-label="cart"
                  data-testid="cart-button"
                  @click="isSidebarOpen = true"
                >
                  <ShoppingCartIcon
                    class="w-6 h-6 text-current"
                  />
                  <span
                    v-if="count > 0"
                    class="text-[10px] font-medium text-white absolute bg-gray-900 rounded-full w-5 h-5 top-0 right-0 leading-5"
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
      <!-- For Mobile -->
      <div class="header-mobile block lg:hidden container mx-auto">
        <div
          class="flex justify-between items-center py-5 space-x-4"
        >
          <div class="flex-[2_2_0%] flex gap-4">
            <LayoutSideMenu />
            <AccountMenu />
          </div>
          <div class="flex-1 flex justify-center">
            <div>
              <RouterLink to="/" class="text-current">
                <span class="sr-only">LUXED</span>
                <div :class="[
                    'w-40 h-5 i-custom:logo',
                    headerMode === 'transparent' ? 'text-white' : 'text-black'
                  ]"
                />
              </RouterLink>
            </div>
          </div>

          <div class="flex-[2_2_0%] flex gap-4 items-center justify-end">
            <!-- <LayoutStoreSearch /> -->
            <div class="flex flow-root">
              <button
                class="group -m-2 p-2 flex items-center relative"
                aria-label="wishlist"
                data-testid="wishlist-button"
                @click="openWishlist"
              >
                <HeartIcon
                  class="w-6 h-6 text-current hover:text-brand-primary"
                />
                <span
                  v-if="wishlistCount > 0"
                  class="text-[10px] font-medium text-white absolute bg-gray-900 rounded-full w-5 h-5 top-0 right-0 leading-5"
                >
                  {{ wishlistCount }}
                </span>
              </button>
            </div>
            <!-- Cart -->
            <div class="flex flow-root">
              <button
                class="group -m-2 p-2 flex items-center relative"
                aria-label="cart"
                data-testid="cart-button"
                @click="isSidebarOpen = true"
              >
                <ShoppingCartIcon
                  class="w-6 h-6 text-current hover:text-brand-primary"
                />
                <span
                  v-if="count > 0"
                  class="text-[10px] font-medium text-white absolute bg-gray-900 rounded-full w-5 h-5 top-0 right-0 leading-5"
                >
                  {{ count || "" }}
                </span>
                <span class="sr-only">items in cart, view bag</span>
              </button>
            </div>
          </div>
        </div>
        <LayoutStoreSearch class="w-full mb-3" />
      </div>
    </nav>
  </header>
</template>
