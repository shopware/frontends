<script lang="ts" setup>
import { getProductRoute } from "@shopware/helpers";

const model = defineModel<string>({ required: true });

const { displayTotal = 10 } = defineProps<{
  displayTotal?: number;
}>();

const { searchTerm, search, getProducts, getTotal, loading } =
  useProductSearchSuggest();

const localePath = useLocalePath();
const { formatLink } = useInternationalization(localePath);

const performSuggestSearch = useDebounceFn((value) => {
  searchTerm.value = value;
  search();
}, 300);

const showSuggest = computed(
  () => model.value.length >= 3 && suggestIsActive.value,
);

watch(model, (value) => {
  if (value.length >= 3) {
    performSuggestSearch(value);
  }
});

const refSearchBox = useTemplateRef("searchBox");
const suggestIsActive = ref(true);
onClickOutside(refSearchBox, () => {
  suggestIsActive.value = false;
});
</script>

<template>
  <div ref="searchBox">
    <FormBaseInput
      v-model="model"
      placeholder="Search"
      @click="suggestIsActive = true"
      @focus="suggestIsActive = true"
    >
      <template #rightIcon>
        <Icon
          name="shopware:search-s"
          class="color-surface-on-surface-variant rotate-90 ml-2"
        />
      </template>
    </FormBaseInput>

    <div
      v-if="showSuggest"
      data-testid="layout-search-result-box"
      class="absolute top-full left-0 mt-2 border-1 border-outline-outline-variant rounded-lg shadow-lg overflow-hidden z-20 bg-surface-surface w-full"
    >
      <NuxtLink
        v-for="product in getProducts?.slice(0, displayTotal)"
        :key="product.id"
        :to="formatLink(getProductRoute(product))"
        data-testid="layout-search-suggest-link"
      >
        <SearchSuggest :product="product" />
      </NuxtLink>

      <div
        class="h-11 text-sm p-3 text-center transition border-t-1 border-outline-outline-variant"
        :class="[
          loading
            ? ['bg-brand-primary text-brand-on-primary']
            : ['bg-surface-surface-container text-surface-on-surface-variant'],
        ]"
      >
        <div
          v-if="loading"
          class="w-80 h-40 bg-surface-surface-container blur-2xl fixed animate-spin"
        />
        <div v-else>
          <NuxtLink
            v-if="getTotal > 0"
            data-testid="layout-search-result-box-more-link"
            :to="formatLink({ path: `/search`, query: { search: model } })"
          >
            {{ $t("search.see") }}
            <span v-if="getTotal !== 1">{{ $t("search.all") }}</span>
            {{ getTotal }}
            <span>{{ $t("search.result", getTotal) }}</span>
          </NuxtLink>
          <div v-else data-testid="layout-search-result-box-no-result">
            {{ $t("search.noResults") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
