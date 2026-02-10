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

const miniCartActive = ref(false);
function toggleMiniCart() {
  miniCartActive.value = !miniCartActive.value;
}

const accountMenuActive = ref(false);
function toggleAccountMenu() {
  accountMenuActive.value = !accountMenuActive.value;
}

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

function toggleMobileSearch() {
  mobileSearchActive.value = !mobileSearchActive.value;
}

function handleMyAccountClick() {
  if (!isLoggedIn.value) {
    loginModalController.open();
  } else {
    toggleAccountMenu();
  }
}

const route = useRoute();
watch(
  () => route.path,
  () => {
    miniCartActive.value = false;
    accountMenuActive.value = false;
  },
);
</script>

<template>
  <div>
    <div class="border-b">
      <div
        class="container mx-auto flex sm:grid sm:grid-cols-3 items-center justify-between py-3.5 px-6 sm:px-0 relative"
      >
        <template v-if="!mobileSearchActive">
          <NuxtLink
            :to="formatLink('/')"
            class="flex-shrink-0 sm:justify-self-start"
          >
            <NuxtImg class="h-20 max-sm:h-10" src="/logo.svg" alt="logo" />
          </NuxtLink>
          <LayoutHeaderSearch
            v-model="searchText"
            class="max-sm:hidden justify-self-center w-full relative"
          />
          <div class="flex gap-4 flex-shrink-0 sm:justify-self-end">
            <LayoutHeaderSearchIcon
              @click="toggleMobileSearch"
              class="hidden max-sm:block"
            />
            <div class="relative">
              <FormIconButton
                type="ghost"
                @click="handleMyAccountClick"
                :aria-label="$t('layout.header.myAccount')"
              >
                <LayoutHeaderMyAccountIcon />
              </FormIconButton>
              <ClientOnly>
                <Transition
                  enter-active-class="transition ease-out duration-150"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="transition ease-in duration-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <LayoutAccountMenu
                    v-if="accountMenuActive && isLoggedIn"
                    class="absolute top-full right-0 mt-2"
                    @closeAccountMenu="toggleAccountMenu"
                  />
                </Transition>
              </ClientOnly>
            </div>
            <ClientOnly>
              <LayoutHeaderWishlistIcon :counter="wishlistCount" />
              <template #fallback>
                <LayoutHeaderWishlistIcon
                  :counter="0"
                />
              </template>
            </ClientOnly>

            <FormIconButton type="ghost" @click="toggleMiniCart" :aria-label="$t('layout.header.cart')">
              <ClientOnly>
                <LayoutHeaderCartIcon :counter="cartCount" />
                <template #fallback>
                  <LayoutHeaderCartIcon :counter="0" />
                </template>
              </ClientOnly>
            </FormIconButton>

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

        <ClientOnly>
          <LayoutMiniCart
            v-if="miniCartActive && cartCount > 0"
            class="absolute top-full right-0"
            @closeMiniCart="toggleMiniCart"
          />
        </ClientOnly>
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
