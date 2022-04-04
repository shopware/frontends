<script setup lang="ts">
import { useCart } from "@shopware-pwa/composables";

const { isOpen, switchState } = useUIState({
  stateName: "isModalOpen"
});
const { isLoggedIn, logout, user, refreshUser } = useUser();
const { count } = useCart();
const isSidebarOpen = inject("isSidebarOpen");
const isAccountMenuOpen = ref(false);
//
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

        <div class="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          <div class="my-account-area">
            <div v-if="!isLoggedIn">
              <button
                @click="switchState()"
                class="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Sign in
              </button>
              <Teleport v-if="isOpen" to="#modal-content">
                <SwLoginForm @close="switchState()"/>
              </Teleport>
            </div>
            <div v-else>
              <div class="absolute inset-y-2 right-2 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button type="button" class="focus:outline-none"  @click="isAccountMenuOpen = !isAccountMenuOpen">
                  Hello, {{ user?.firstName }}!
                </button>

                <!-- Profile dropdown -->
                <div class="ml-3 relative">
                  <div>
                    <button type="button" class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true" @click="isAccountMenuOpen = !isAccountMenuOpen">
                      <span class="sr-only">Open user menu</span>
                    </button>
                  </div>
                  <Transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div :class="[isAccountMenuOpen ? 'block' : 'hidden']" class="origin-top-right absolute right-0 top-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                        <!-- Active: "bg-gray-100", Not Active: "" -->
                        <!-- <a href="#" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Your Profile</a> -->
                        <button @click="!(async () => { await logout() && refreshUser()})();" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</button>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
          <!-- <a
            href="#"
            class="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign up
          </a> -->
        </div>
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
