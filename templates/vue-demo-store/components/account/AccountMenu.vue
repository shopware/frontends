<script setup lang="ts">
import { SharedModal } from "~~/components/shared/SharedModal.vue";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import {
  Dialog,
  DialogPanel, TransitionChild, TransitionRoot,
} from '@headlessui/vue';

const { isLoggedIn, logout } = useUser();
const modal = inject<SharedModal>("modal") as SharedModal;
const headerMode = useState<'default' | 'transparent'>('headerMode', () => 'default');
const router = useRouter();
const userMenuOpened = inject("userMenuOpened", ref(false));
const close = () => {
  userMenuOpened.value = false;
}

const openAccountOnDesktop = () => {
  if (!isLoggedIn.value) {
    modal.open('AccountLoginForm', {
      position: 'side'
    })
  } else {
    router.push('/account');
  }
}

const openAccountOnMobile = () => {
  if (!isLoggedIn.value) {
    modal.open('AccountLoginForm', {
      position: 'side'
    })
  } else {
    userMenuOpened.value = true;
  }
}

const invokeLogout = () => {
  logout();
  userMenuOpened.value = false;
}
</script>
<template>
  <div class="md:w-auto">
    <div class="my-account-area">
      <!-- UserIcon for desktop -->
      <UserIcon
        :class="[
          'hidden md:block w-6 h-6 text-current cursor-pointer',
          headerMode === 'transparent' ? 'hover:text-gray-300' : 'hover:text-gray-900'
        ]"
        @click="openAccountOnDesktop"
      />
      <!-- UserIcon for mobile -->
      <UserIcon
        :class="[
          'block md:hidden w-6 h-6 text-current cursor-pointer',
          headerMode === 'transparent' ? 'hover:text-gray-300' : 'hover:text-gray-900'
        ]"
        @click="openAccountOnMobile"
      />
    </div>
  </div>
  <TransitionRoot
    :show="userMenuOpened"
    appear
    as="template"
  >
    <Dialog
      as="div"
      class="lg:hidden"
      @close="close"
    >
      <TransitionChild
        as="template"
        enter="duration-500 ease-in-out"
        enter-from="translate-x-full"
        enter-to="translate-x-0"
        leave="duration-500 ease-out"
        leave-from="translate-x-0"
        leave-to="translate-x-full"
      >
        <div class="fixed inset-0 z-10 bg-gray-500 bg-opacity-60" />
      </TransitionChild>
      <TransitionChild
        as="template"
        enter="duration-500 ease-in-out"
        enter-from="translate-x-full"
        enter-to="translate-x-0"
        leave="duration-500 ease-out"
        leave-from="translate-x-0"
        leave-to="translate-x-full"
      >
        <DialogPanel class="flex flex-col fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="container py-6 flex items-center justify-between">
            <div>
              <h4 class="font-medium text-lg">
                Hello, Jonas Lindeborg
              </h4>
            </div>
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-700 outline-none"
              @click="close"
            >
              <span class="sr-only">Close menu</span>
              <XMarkIcon
                class="h-6 w-6"
                aria-hidden="true"
              />
            </button>
          </div>
          <ul class="container space-y-1 mb-6">
            <li>
              <NuxtLink
                to="/account"
                class="flex items-center px-3 py-2 text-gray-600 text-base font-medium"
                @click="close"
              >
                <span>Account Overview</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/profile"
                class="flex items-center px-3 py-2 text-gray-600 text-base font-medium"
                @click="close"
              >
                <span>My profile</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/address"
                class="flex items-center px-3 py-2 text-gray-600 text-base font-medium"
                @click="close"
              >
                <span>Addresses</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/payment"
                class="flex items-center px-3 py-2 text-gray-600 text-base font-medium"
                @click="close"
              >
                <span>Payment methods</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/account/order"
                class="flex items-center px-3 py-2 text-gray-600 text-base font-medium"
                @click="close"
              >
                <span>Orders</span>
              </NuxtLink>
            </li>
          </ul>
          <div class="container">
            <button
              class="flex items-center border border-gray-300 shadow-sm py-2 px-4 hover:bg-gray-50"
              @click="invokeLogout()"
            >
              <ArrowRightOnRectangleIcon class="h-5 w-5 text-gray-500" />
              <span class="ml-2 text-gray-700 text-sm font-medium">Logout</span>
            </button>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
