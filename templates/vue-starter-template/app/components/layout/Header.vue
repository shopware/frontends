<script lang="ts" setup>
const { count: cartCount } = useCart();
const { count: wishlistCount } = useWishlist();
const { isLoggedIn } = useUser();
const { push } = useRouter();
const loginModalController = useModal();

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
  <div class="border-b">
    <div class="container mx-auto flex items-center justify-between py-3.5">
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
          <SwIconButton type="ghost" @click="handleMyAccountClick"
            ><LayoutHeaderMyAccountIcon
          /></SwIconButton>
          <SwWishlistIcon :counter="wishlistCount" />
          <LayoutHeaderCartIcon :counter="cartCount" />
          <LayoutHeaderMobileMenuIcon class="hidden max-sm:block" />
        </div>
      </template>
      <template v-else>
        <LayoutHeaderSearch v-model="searchText" />
        <FormLinkButton @click="toggleMobileSearch" label="Close" />
      </template>
    </div>
    <ClientOnly>
      <SharedModal v-if="!isLoggedIn" :controller="loginModalController">
        <AccountLoginForm @close="loginModalController.close" />
      </SharedModal>
    </ClientOnly>
  </div>
</template>
