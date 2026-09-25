<script setup lang="ts">
import { getProductRoute, getTranslatedProperty } from "@shopware/helpers";
import { onClickOutside, useDebounceFn } from "@vueuse/core";

const { searchTerm, search, getProducts, getTotal } = useProductSearchSuggest();

const localePath = (path: string) => path;
const { formatLink } = useInternationalization(localePath);

const MIN_TERM_LENGTH = 3;

const typingTerm = ref("");
const appliedTerm = ref("");
const isOpen = ref(false);
const pending = ref(false);
const searchError = ref("");

let requestId = 0;

const runSuggestSearch = useDebounceFn(async (term: string) => {
  const id = ++requestId;
  pending.value = true;
  searchTerm.value = term;

  try {
    await search({ limit: 10, "no-aggregations": "1" });
    if (id !== requestId) return;
    appliedTerm.value = term;
    searchError.value = "";
  } catch (error) {
    if (id !== requestId) return;
    console.error(error);
    searchError.value = "The search is currently unavailable.";
  } finally {
    if (id === requestId) pending.value = false;
  }
}, 300);

watch(typingTerm, (term) => {
  searchError.value = "";

  if (term.length >= MIN_TERM_LENGTH) {
    runSuggestSearch(term);
  } else {
    pending.value = false;
  }
});

const showSuggest = computed(
  () => isOpen.value && typingTerm.value.length >= MIN_TERM_LENGTH,
);

const isStale = computed(() => appliedTerm.value !== typingTerm.value);

const close = () => {
  isOpen.value = false;
};

const searchBox = useTemplateRef("searchBox");
onClickOutside(searchBox, close);
</script>

<template>
  <div ref="searchBox">
    <label>
      Search
      <input
        v-model="typingTerm"
        type="search"
        autocomplete="off"
        @focus="isOpen = true"
        @keydown.esc="close"
      />
    </label>

    <p v-if="showSuggest && searchError" role="alert">{{ searchError }}</p>

    <div v-else-if="showSuggest" aria-live="polite">
      <p v-if="pending || isStale">Searching…</p>

      <p v-else-if="!getProducts.length">Nothing matches “{{ typingTerm }}”.</p>

      <template v-else>
        <ul>
          <li v-for="product in getProducts" :key="product.id">
            <NuxtLink :to="formatLink(getProductRoute(product))" @click="close">
              {{ getTranslatedProperty(product, "name") }}
            </NuxtLink>
          </li>
        </ul>

        <NuxtLink
          :to="formatLink({ path: '/search', query: { search: typingTerm } })"
          @click="close"
        >
          Show all {{ getTotal }} results
        </NuxtLink>
      </template>
    </div>
  </div>
</template>
