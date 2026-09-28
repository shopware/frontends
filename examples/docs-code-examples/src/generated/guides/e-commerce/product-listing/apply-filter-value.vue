<script setup lang="ts">
const { setCurrentFilters } = useListing({
  listingType: "categoryListing",
});

setCurrentFilters([
  {
    code: "properties",
    value: ["some-property-id"],
  },
]);

// or

setCurrentFilters([
  {
    code: "rating",
    value: 5, // 5 stars rated products
  },
]);
</script>
