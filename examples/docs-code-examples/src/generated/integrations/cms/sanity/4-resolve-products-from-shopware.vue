<!-- app/components/sections/SectionFeaturedProducts.vue -->
<script setup lang="ts">
import { useAsyncData, useProductSearch } from "#imports";
const props = defineProps<{
  section: { _key?: string; heading?: string; productIds?: string[] };
}>();

const { search } = useProductSearch();

const { data: products } = await useAsyncData(
  `featured-products-${props.section._key}`,
  async () => {
    const ids = props.section.productIds ?? [];
    const resolved = await Promise.all(
      ids.map((id) =>
        search(id)
          .then((r) => r.product)
          .catch(() => null),
      ),
    );
    return resolved.filter(Boolean);
  },
);
</script>
