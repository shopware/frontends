<script setup lang="ts">
import { useListing } from "#imports";
const { setCurrentFilters } = useListing(/** parameters omitted */);

setCurrentFilters({
  code: "properties",
  value: "some-property-id",
});

// or

setCurrentFilters({
  code: "rating",
  value: 5, // 5 stars rated products
});
</script>
