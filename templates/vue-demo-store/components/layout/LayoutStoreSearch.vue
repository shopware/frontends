<script setup lang="ts">
import {
  getMainImageUrl,
  getProductUrl,
  getProductCalculatedListingPrice,
  getTranslatedProperty,
  debounce,
} from "@shopware-pwa/helpers-next";

import { onClickOutside, useFocus, useMagicKeys } from "@vueuse/core";

const { searchTerm, search, getProducts, getTotal, loading } =
  useProductSearchSuggest();

// True when the search bar is active and user can type in the search field
const active = ref(false);

// Reference to the search container
const searchContainer = ref(null);
const searchInput = ref(null);

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

const { enter } = useMagicKeys();
const { push } = useRouter();

watch(enter, (value) => {
  if (!value) return;
  push("/search?query=" + typingQuery.value);
});
</script>

<template>
  <div class="hidden lg:flex">
    <div
      class="relative group bg-white p-3 rounded-lg transition duration-300 hover:shadow-md"
      :class="[active ? ['shadow-md', 'w-90'] : 'w-90']"
      ref="searchContainer"
    >
      <div class="flex items-center">
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          @click="active = true"
          class="sw-search-input flex-none h-6 w-6 fill-gray group-hover:fill-gray-500 cursor-pointer"
        >
          <path
            d="M20.47 21.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-9.97-4.28a6.75 6.75 0 0 1-6.75-6.75h-1.5a8.25 8.25 0 0 0 8.25 8.25v-1.5ZM3.75 10.5a6.75 6.75 0 0 1 6.75-6.75v-1.5a8.25 8.25 0 0 0-8.25 8.25h1.5Zm6.75-6.75a6.75 6.75 0 0 1 6.75 6.75h1.5a8.25 8.25 0 0 0-8.25-8.25v1.5Zm11.03 16.72-5.196-5.197-1.061 1.06 5.197 5.197 1.06-1.06Zm-4.28-9.97c0 1.864-.755 3.55-1.977 4.773l1.06 1.06A8.226 8.226 0 0 0 18.75 10.5h-1.5Zm-1.977 4.773A6.727 6.727 0 0 1 10.5 17.25v1.5a8.226 8.226 0 0 0 5.834-2.416l-1.061-1.061Z"
          ></path>
        </svg>
        <input
          @click="active = true"
          type="text"
          class="sw-search-input text-gray-400 placeholder:text-gray-400 focus:text-gray-700 p-2 ml-2 grow h-6 transition duration-200 focus:outline-none"
          placeholder="Search products"
          v-model="typingQuery"
          ref="searchInput"
        />
      </div>
      <div
        class="mx--3 mt-2 w-90 absolute shadow-md rounded-b-md border-t-1 border-gray-100 overflow-hidden transition-height duration-300 z-1"
        v-if="showSuggest"
      >
        <router-link
          v-for="product in getProducts"
          v-bind:key="product.id"
          :to="getProductUrl(product)"
          @click="active = false"
        >
          <div
            class="p-3 h-14 text-sm flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition duration-300 bg-white"
          >
            <div
              class="rounded-md border-1 border-gray-200 overflow-hidden flex-none"
            >
              <img
                :src="getMainImageUrl(product)"
                class="h-8 w-8 object-cover"
                alt="Product image"
              />
            </div>
            <div
              class="flex items-center justify-between overflow-hidden gap-5"
            >
              <div
                class="w-56 text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {{ getTranslatedProperty(product, "name") }}
              </div>
              <div class="w-10 flex-none text-right">
                {{ getProductCalculatedListingPrice(product) }}
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
            class="w-80 h-40 bg-brand-light blur-2xl fixed animate-spin"
            v-if="loading"
          ></div>
          <div v-else>
            <div v-if="getTotal > 0">
              See <span v-if="getTotal !== 1">all</span> {{ getTotal }}
              <span v-if="getTotal !== 1">results</span
              ><span v-if="getTotal == 1">result</span>
            </div>
            <div v-else>No results :(</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
