<script setup lang="ts">
const { logout } = useUser();
const router = useRouter();

const route = useRoute();
const to = route.query.to as string;
const params = { to: to };

useAuthGuardRedirection(params);

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

function handleLogout() {
  logout();
  router.push(formatLink("/"));
}
</script>
<template>
  <div class="container mx-auto px-6 sm:px-4 mt-5 md:mt-20 flex gap-20">
    <nav class="flex-col gap-3 hidden md:flex text-nowrap" aria-label="Account navigation">
      <h2 class="text-brand-primary text-base font-bold leading-normal">
        {{ $t("account.menu.header") }}
      </h2>
      <AccountMenuList @logout="handleLogout" />
    </nav>
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>
