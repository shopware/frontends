<script lang="ts">
export default {
  name: "AccountLayout",
};
</script>

<script setup lang="ts">
// Navigation for Account page
const { loadNavigationElements } = useNavigation();
const { data } = await useAsyncData("mainNavigation", () => {
  return loadNavigationElements({ depth: 2 });
});
provide("swNavigation-main-navigation", data);

const { loadNavigationElements: loadFooterNavigationElements } = useNavigation({
  type: "footer-navigation",
});
const { data: footerData } = await useAsyncData("mainFooterNavigation", () => {
  return loadFooterNavigationElements({ depth: 2 });
});
provide("swNavigation-footer-navigation", footerData);
</script>

<template>
  <SharedModal />
  <LayoutHeader />
  <LayoutNotifications />

  <div class="max-w-screen-xl mx-auto min-h-full">
    <div class="m-10">
      <div class="account-inner">
        <div class="md:grid md:grid-cols-3 md:gap-6">
          <aside
            class="hidden md:block lg:w-64 md:col-span-"
            aria-label="Sidebar"
          >
            <div
              class="overflow-y-auto py-4 px-3 bg-gray-50 text-base font-normal text-gray-500 rounded"
            >
              <h1
                class="self-center text-xl p-2 mb-2 font-semibold whitespace-nowrap"
              >
                My account
              </h1>
              <ul class="space-y-2">
                <li>
                  <router-link
                    to="/account/profile"
                    class="flex items-center p-2 rounded-lg hover:text-brand-primary hover:bg-gray-100 is-active"
                  >
                    <div i-carbon-user text-xl inline-block />
                    <span class="ml-3">My profile</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/account/address"
                    class="flex items-center p-2 rounded-lg hover:text-brand-primary hover:bg-gray-100"
                  >
                    <div i-carbon-home text-xl inline-block />
                    <span class="ml-3">My address</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/account/payment"
                    class="flex items-center p-2 rounded-lg hover:text-brand-primary hover:bg-gray-100"
                  >
                    <div i-carbon-wallet text-xl inline-block />
                    <span class="ml-3">Payment</span>
                  </router-link>
                </li>
              </ul>
              <ul class="pt-4 mt-4 space-y-2 border-t border-gray-200">
                <li>
                  <router-link
                    to="/account/order"
                    class="flex items-center p-2 rounded-lg hover:text-brand-primary hover:bg-gray-100"
                  >
                    <div i-carbon-order-details text-xl inline-block />
                    <span class="ml-3">Order history</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/account/order"
                    class="flex items-center p-2 rounded-lg hover:text-brand-primary hover:bg-gray-100"
                  >
                    <div i-carbon-logout text-xl inline-block />
                    <span class="ml-3">Logout</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </aside>
          <main class="md:col-span-2">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>

  <CheckoutSideCart />
  <LayoutFooter />
</template>
