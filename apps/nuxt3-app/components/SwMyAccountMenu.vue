<script setup lang="ts">
const { isOpen, switchState } = useUIState({
  stateName: "isModalOpen"
});
const { isLoggedIn, logout, user, refreshUser } = useUser();
const isAccountMenuOpen = ref(false);
</script>
<template>
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
        <button type="button" class="text-sm text-gray-700 focus:outline-none"  @click="isAccountMenuOpen = !isAccountMenuOpen">
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
</template>