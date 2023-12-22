<script lang="ts">
export default {
  name: "AccountLayout",
};
</script>

<script setup lang="ts">
const route = useRoute();
const to = route.query.to as string;
const params = { to: to };

useAuthGuardRedirection(params);

// Navigation for Account page
const { loadNavigationElements } = useNavigation();
const { logout } = useUser();
const router = useRouter();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

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

async function invokeLogout() {
  logout();
  router.push("/");
}

provide("swNavigation-footer-navigation", footerData);
</script>

<template>
  <div>
    <LayoutHeader />
    <LayoutNotifications />
    <LayoutBreadcrumbs />
    <div class="max-w-screen-xl mx-auto min-h-full">
      <div class="m-10">
        <div class="account-inner">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <aside class="block lg:w-64 md:col-span-" aria-label="Sidebar">
              <div
                class="overflow-y-auto md:py-4 md:px-3 md:bg-secondary-50 text-base font-normal text-secondary-500 rounded"
              >
                <h1
                  class="self-center text-xl px-0 md:px-2 py-2 mb-2 font-semibold whitespace-nowrap"
                >
                  {{ $t("account.menu.myAccount") }}
                </h1>
                <ul class="space-y-2 list-none pl-0">
                  <li>
                    <NuxtLink
                      :to="formatLink(`/account`)"
                      class="flex items-center px-0 md:px-2 py-2 rounded-lg hover:text-primary hover:bg-secondary-100 is-active"
                    >
                      <div i-carbon-dashboard text-xl inline-block />
                      <span class="ml-3">
                        {{ $t("account.menu.accountOverviewHeader") }}</span
                      >
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="formatLink(`/account/profile`)"
                      class="flex items-center px-0 md:px-2 py-2 rounded-lg hover:text-primary hover:bg-secondary-100 is-active"
                    >
                      <div i-carbon-user text-xl inline-block />
                      <span class="ml-3">{{ $t("account.yourProfile") }}</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="formatLink(`/account/address`)"
                      class="flex items-center px-0 md:px-2 py-2 rounded-lg hover:text-primary hover:bg-secondary-100"
                    >
                      <div i-carbon-home text-xl inline-block />
                      <span class="ml-3">{{ $t("account.yourAddress") }}</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      :to="formatLink(`/account/payment`)"
                      class="flex items-center px-0 md:px-2 py-2 rounded-lg hover:text-primary hover:bg-secondary-100"
                    >
                      <div i-carbon-wallet text-xl inline-block />
                      <span class="ml-3">{{
                        $t("account.myPaymentsHeader")
                      }}</span>
                    </NuxtLink>
                  </li>
                </ul>
                <ul
                  class="pt-4 mt-4 space-y-2 border-t border-secondary-200 list-none pl-0"
                >
                  <li>
                    <NuxtLink
                      :to="formatLink(`/account/order`)"
                      class="flex items-center px-0 md:px-2 py-2 rounded-lg hover:text-primary hover:bg-secondary-100"
                    >
                      <div i-carbon-order-details text-xl inline-block />
                      <span class="ml-3">{{
                        $t("account.orderHistoryHeader")
                      }}</span>
                    </NuxtLink>
                  </li>
                  <li>
                    <button
                      class="flex items-center rounded-lg px-0 md:px-2 py-2 hover:text-primary hover:bg-secondary-100 w-full"
                      @click="invokeLogout()"
                    >
                      <div i-carbon-logout text-xl inline-block />
                      <span class="ml-3 text-secondary-700">{{
                        $t("account.logout")
                      }}</span>
                    </button>
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

    <LayoutFooter />
  </div>
</template>
