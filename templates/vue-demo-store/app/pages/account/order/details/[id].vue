<script setup lang="ts">
definePageMeta({
  layout: "account",
});

const route = useRoute();
const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const generateBackLink = () => {
  if (document.referrer) {
    const url = new URL(document.referrer);
    if (url.pathname.includes("/account/order")) {
      return `${url.pathname}${url.search}`;
    }
  }
  return "/account/order";
};
</script>

<template>
  <div>
    <p class="mb-2">
      <NuxtLink
        class="text-sm flex flex-row gap-1"
        :to="formatLink(generateBackLink())"
      >
        <div class="w-5 h-5 i-carbon-chevron-left" />
        {{ $t("account.orderDetails.backToOrdersList") }}</NuxtLink
      >
    </p>
    <main>
      <AccountOrderDetailView :order-id="(route.params.id as string)" />
    </main>
  </div>
</template>
