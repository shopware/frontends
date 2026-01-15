<script setup lang="ts">
const emit = defineEmits<{
  logout: [];
}>();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

function handleLogout() {
  emit("logout");
}
</script>
<template>
  <menu class="flex flex-col gap-3">
    <li>
      <AccountMenuElement
        :link="formatLink('/account')"
        :label="$t('account.menu.overview')"
      />
    </li>
    <li>
      <AccountMenuElement
        :link="formatLink('/account/profile')"
        :label="$t('account.menu.yourProfile')"
      />
    </li>
    <li>
      <AccountMenuElement
        :link="formatLink('/account/address')"
        :label="$t('account.menu.addresses')"
      />
    </li>
    <li>
      <AccountMenuElement
        :link="formatLink('/account/order')"
        :label="$t('account.menu.orders')"
      />
    </li>
    <li>
      <FormLinkButton
        class="text-other-sale text-normal hover:border-b hover:border-other-sale"
        @click="handleLogout"
       :label="$t('account.menu.logout')"
      />
    </li>
  </menu>
</template>
