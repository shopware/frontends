<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

const { logout } = useUser();
const router = useRouter();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const emit = defineEmits<{
  closeAccountMenu: [];
}>();

const accountMenuContainer = useTemplateRef("accountMenuContainer");

function handleCloseAccountMenu() {
  emit("closeAccountMenu");
}

function handleLogout() {
  logout();
  router.push(formatLink("/"));
  handleCloseAccountMenu();
}

onClickOutside(accountMenuContainer, () => {
  handleCloseAccountMenu();
});
</script>

<template>
  <div ref="accountMenuContainer" class="z-20">
    <div class="px-6 py-4 border bg-surface-surface flex flex-col gap-3">
      <AccountMenuElement
        class="text-nowrap"
        :link="formatLink('/account')"
        :label="$t('account.menu.overview')"
        @click="handleCloseAccountMenu"
      />
      <AccountMenuElement
        class="text-nowrap"
        :link="formatLink('/account/profile')"
        :label="$t('account.menu.yourProfile')"
        @click="handleCloseAccountMenu"
      />
      <AccountMenuElement
        class="text-nowrap"
        :link="formatLink('/account/address')"
        :label="$t('account.menu.addresses')"
        @click="handleCloseAccountMenu"
      />
      <AccountMenuElement
        class="text-nowrap"
        :link="formatLink('/account/order')"
        :label="$t('account.menu.orders')"
        @click="handleCloseAccountMenu"
      />
      <FormLinkButton
        class="text-other-sale text-normal hover:border-b hover:border-other-sale text-left"
        @click="handleLogout"
        label="Logout"
      />
    </div>
  </div>
</template>
