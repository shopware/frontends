<script lang="ts">
export default {
  name: "ShopwareTeamPage",
};
</script>
<script setup lang="ts">
const images = ref([
  "https://ca.slack-edge.com/T04UKLWGP-UC04NDP6U-cd3e568af126-512",
  "https://ca.slack-edge.com/T04UKLWGP-U019L64GA0N-20cbf24d0fef-512",
  "https://ca.slack-edge.com/T04UKLWGP-UBKPK8MA7-05b74f81ebb0-512",
  "https://ca.slack-edge.com/T04UKLWGP-U018NPJ1DGV-59461971434c-512",
  "https://ca.slack-edge.com/T04UKLWGP-U2CBTH44U-3e217ae809fa-512",
  "https://ca.slack-edge.com/T04UKLWGP-U017HES3HNV-d939ac432cf7-512",
  "https://ca.slack-edge.com/T04UKLWGP-U02N63ET3B2-e8cb6a2b28cc-512",
  "https://ca.slack-edge.com/T04UKLWGP-U01QUP9TR24-1a968e0cdf8a-512",
  "https://ca.slack-edge.com/T04UKLWGP-U01J0D112S0-660da47c5a10-512",
  "https://ca.slack-edge.com/T04UKLWGP-U02132D5JKS-206e488a36a8-512",
  "https://ca.slack-edge.com/T04UKLWGP-U01HACL0RQ9-8d9dfcecfc64-512",
]);
useBreadcrumbs([
  {
    name: "Shopware",
    path: "/shopware",
  },
]);
</script>

<template>
  <LayoutBreadcrumbs />
  <div class="flex justify-center">
    <img
      class="md:w-11/12"
      src="https://raw.githubusercontent.com/shopware/frontends/main/.readme/shopware-frontends-logo.png"
      alt="logo shopware frontends"
    />
  </div>

  <div class="mx-10 mt-10 flex flex-wrap justify-center">
    <div
      v-for="image in images"
      :key="image"
      class="max-w-30 rounded-full overflow-hidden m-3"
    >
      <img :src="image" alt="Cms image" />
    </div>
  </div>

  <div class="mx-10 mt-10 flex flex-wrap justify-center">
    <img
      class="md:w-9/12"
      src="https://raw.githubusercontent.com/shopware/frontends/main/.readme/shopware-frontends-techstack.png"
      alt="techstack shopware frontends"
    />
  </div>
</template>
