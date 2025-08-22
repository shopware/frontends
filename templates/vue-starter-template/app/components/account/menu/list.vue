<script setup lang="ts">
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);
</script>
<template>
  <menu>
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
        :link="formatLink('/account/addresses')"
        :label="$t('account.menu.addresses')"
      />
    </li>
    <li>
      <AccountMenuElement
        :link="formatLink('/account/order')"
        :label="$t('account.menu.orders')"
      />
    </li>
    <li></li>
  </menu>
</template>
