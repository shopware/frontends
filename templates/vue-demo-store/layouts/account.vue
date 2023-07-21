<script lang="ts">
export default {
  name: "AccountLayout",
};
</script>

<script setup lang="ts">
import DefaultLayout from './default.vue';
import {
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';
useAuthGuardRedirection();

const { logout } = useUser();
const router = useRouter();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

async function invokeLogout() {
  logout();
  router.push("/");
}

</script>

<template>
  <DefaultLayout>
    <div class="container flex md:space-x-8 mt-6 justify-between">
      <aside
        :class="{
          'w-70 hidden md:block': true,
        }"
      >
        <h4 class="font-medium text-lg mb-8">Hello, Jonas Lindeborg</h4>
        <ul class="space-y-1 mb-8">
          <li>
            <NuxtLink
              to="/account"
              class="flex items-center px-3 py-2 text-gray-700 text-sm font-medium"
            >
              <span>Account Overview</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/account/profile"
              class="flex items-center px-3 py-2 text-gray-700 text-sm font-medium"
            >
              <span>My profile</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/account/address"
              class="flex items-center px-3 py-2 text-gray-700 text-sm font-medium"
            >
              <span>Addresses</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/account/payment"
              class="flex items-center px-3 py-2 text-gray-700 text-sm font-medium"
            >
              <span>Payment methods</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/account/order"
              class="flex items-center px-3 py-2 text-gray-700 text-sm font-medium"
            >
              <span>Orders</span>
            </NuxtLink>
          </li>
        </ul>
        <div>
          <button
            class="flex items-center border border-gray-300 shadow-sm py-2 px-4 hover:bg-gray-50"
            @click="invokeLogout()"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5 text-gray-500"/>
            <span class="ml-2 text-gray-700 text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
      <main class="flex-1 w-full md:pl-26">
        <slot />
      </main>
    </div>
  </DefaultLayout>
</template>
<style scoped>
.router-link-active {
  @apply bg-gray-100 text-gray-900;
}
</style>
