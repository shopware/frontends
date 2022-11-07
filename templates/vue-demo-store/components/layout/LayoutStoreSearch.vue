<script setup lang="ts">
import {
  getMainImageUrl,
  getProductUrl,
  getProductCalculatedListingPrice,
  getTranslatedProperty,
  debounce,
} from "@shopware-pwa/helpers-next";

import { onClickOutside, useFocus, useMagicKeys } from "@vueuse/core";

withDefaults(
  defineProps<{
    displayTotal?: number;
  }>(),
  { displayTotal: 10 }
);

const { searchTerm, search, getProducts, getTotal, loading } =
  useProductSearchSuggest();

// True when the search bar is active and user can type in the search field
const active = ref(false);

// Reference to the search container
const searchContainer = ref(null);
const searchInput = ref();

watch(active, (value) => {
  const { focused } = useFocus(searchInput);

  focused.value = value;
});

// String the user has typed in the search field
const typingQuery = ref("");

watch(typingQuery, (value) => {
  if (value.length >= 3) {
    performSuggestSearch(value);
  }
});

// Defer the search request to prevent the search from being triggered too after typing
const performSuggestSearch = debounce((value) => {
  searchTerm.value = value;
  search();
}, 300);

// Suggest results will only be shown, when the search bar is active and the user has typed more than three characters in the search field
const showSuggest = computed(() => {
  return typingQuery.value.length >= 3 && active.value;
});

if (process.client) {
  onClickOutside(searchContainer, () => {
    active.value = false;
  });
}

const { enter } = useMagicKeys({ target: searchInput });
const { push } = useRouter();

const isSideMenuOpened = inject("isSideMenuOpened", ref(false));

watch(enter, (value) => {
  if (!value) return;

  isSideMenuOpened.value = false;

  active.value = false;
  push("/search?query=" + typingQuery.value);
});
</script>

<template>
  <div
    ref="searchContainer"
    class="relative group bg-white p-3 rounded-lg transition duration-300 hover:shadow-md"
    :class="[active ? 'shadow-md' : 'shadow-sm']"
  >
    <div class="flex items-center">
      <div
        class="sw-search-input i-carbon-search flex-none h-6 w-6 bg-gray-400 group-hover:bg-brand-primary cursor-pointer"
      ></div>

      <input
        data-testid="layout-search-input"
        ref="searchInput"
        v-model="typingQuery"
        type="text"
        class="sw-search-input text-gray-400 placeholder:text-gray-400 focus:text-gray-700 p-2 ml-2 grow h-6 transition duration-200 focus:outline-none"
        placeholder="Search products"
        @click="active = true"
      />
    </div>
    <div
      v-if="showSuggest"
      class="absolute border-gray-100 border-t-1 duration-300 left-0 mt-2 overflow-hidden right-0 rounded-b-md shadow-md transition-height w-auto z-1"
    >
      <router-link
        v-for="product in getProducts.slice(0, displayTotal)"
        :key="product.id"
        :to="getProductUrl(product)"
        @click="[(active = false), (isSideMenuOpened = false)]"
        data-testid="layout-search-suggest-link"
      >
        <div
          class="p-3 h-14 text-sm flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition duration-300 bg-white"
        >
          <div
            class="rounded-md border-1 border-gray-200 overflow-hidden flex-none"
          >
            <img
              data-testid="layout-search-suggest-image"
              :src="getMainImageUrl(product)"
              class="h-8 w-8 object-cover"
              alt="Product image"
            />
          </div>
          <div
            class="flex items-center justify-between overflow-hidden gap-5 grow"
          >
            <div
              data-testid="layout-search-suggest-name"
              class="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ getTranslatedProperty(product, "name") }}
            </div>
            <div class="flex-none text-right">
              <SharedPrice
                v-if="getProductCalculatedListingPrice(product)"
                data-testid="layout-search-suggest-price"
                class="justify-end"
                :value="(getProductCalculatedListingPrice(product) as number)"
              />
              <ProductUnits
                data-testid="layout-search-suggest-units"
                :product="product"
                :show-content="false"
                class="text-3"
              />
            </div>
          </div>
        </div>
      </router-link>

      <div
        class="h-11 text-sm rounded-b-md p-3 text-center transition"
        style="clip-path: inset(0% 0% 0% 0%)"
        :class="[loading ? ['bg-brand-primary'] : ['bg-gray-100']]"
      >
        <div
          v-if="loading"
          class="w-80 h-40 bg-brand-light blur-2xl fixed animate-spin"
        />
        <div v-else>
          <router-link
            v-if="getTotal > 0"
            :to="`/search?query=${typingQuery}`"
            @click="[(active = false), (isSideMenuOpened = false)]"
          >
            See <span v-if="getTotal !== 1">all</span> {{ getTotal }}
            <span v-if="getTotal !== 1">results</span
            ><span v-if="getTotal == 1">result</span>
          </router-link>
          <div v-else>No results :(</div>
        </div>
      </div>
    </div>
  </div>
</template>
