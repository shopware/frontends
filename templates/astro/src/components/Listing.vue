<script setup lang="ts">
import { useListing } from "@shopware-pwa/composables-next";

const { search, getCurrentListing } = useListing({
  listingType: "productSearchListing",
});

const listingSearch = async () => {
  await search({ query: "ice cream" });
  return getCurrentListing.value;
};

const listing = await listingSearch();
</script>
<template>
  <div class="listing">
    This Listing Page Example searches for "ice cream" products
  </div>
  <ul>
    <li v-for="element in listing?.elements">
      {{ element.name }}
    </li>
  </ul>
</template>
