<script lang="ts" setup>
const { count: cartCount } = useCart();
const { count: wishlistCount } = useWishlist();
const { isLoggedIn } = useUser();
const { push } = useRouter();
const loginModalController = useModal();
const sideMenuController = useSideMenuModal();

const currentMenuPosition = ref<string | undefined>(undefined);

const mobileSearchActive = ref(false);
const searchText = ref("");

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

function toggleMobileSearch() {
  mobileSearchActive.value = !mobileSearchActive.value;
}

function handleMyAccountClick() {
  if (!isLoggedIn.value) {
    loginModalController.open();
  } else {
    push(formatLink("/account"));
  }
}
</script>

<template>
  <div>
    <div class="border-b">
      <div
        class="container mx-auto flex items-center justify-between py-3.5 px-6 sm:px-0"
      >
        <template v-if="!mobileSearchActive">
          <NuxtLink :to="formatLink('/')">
            <NuxtImg class="h-20 max-sm:h-10" src="/logo.svg" alt="logo" />
          </NuxtLink>
          <LayoutHeaderSearch v-model="searchText" class="max-sm:hidden" />
          <div class="flex gap-4">
            <LayoutHeaderSearchIcon
              @click="toggleMobileSearch"
              class="hidden max-sm:block"
            />
            <FormIconButton type="ghost" @click="handleMyAccountClick"
              ><LayoutHeaderMyAccountIcon
            /></FormIconButton>
            <LayoutHeaderWishlistIcon :counter="wishlistCount" />
            <LayoutHeaderCartIcon :counter="cartCount" />
            <LayoutHeaderMobileMenuIcon
              class="hidden max-lg:block"
              @click="sideMenuController.open"
            />
          </div>
        </template>
        <template v-else>
          <LayoutHeaderSearch v-model="searchText" />
          <FormLinkButton
            class="text-sm border-b-1 border-b-solid border-b-brand-primary hover:border-none"
            @click="toggleMobileSearch"
            label="Close"
          />
        </template>
      </div>
      <ClientOnly>
        <SharedModal v-if="!isLoggedIn" :controller="loginModalController">
          <AccountLoginForm @close="loginModalController.close" />
        </SharedModal>
      </ClientOnly>
    </div>
    <div
      class="border-b relative max-lg:hidden"
      @mouseleave="currentMenuPosition = undefined"
    >
      <LayoutHeaderTopNavigation
        class="container mx-auto pt-6 pb-4 px-6 sm:px-0"
        v-model:current-menu-position="currentMenuPosition"
      />
      <client-only>
        <div class="absolute w-full bg-white z-10 border-b">
          <LayoutHeaderTopNavigationSubcategories
            class="container mx-auto left-0 right-0"
            :current-menu-position="currentMenuPosition"
          />
        </div>
      </client-only>
    </div>
    <client-only>
      <LayoutSideMenu />
    </client-only>
  </div>
</template>
