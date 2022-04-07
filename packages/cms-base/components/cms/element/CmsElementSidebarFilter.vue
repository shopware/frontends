<script setup lang="ts">
const $props = defineProps(["content", "listingType"])
const cmsPage = inject("cms-page");
const category = computed(() => cmsPage.value?.category || {})
const {
  getCurrentSortingOrder,
  changeCurrentSortingOrder,
  getSortingOrders,
  getAvailableFilters,
  search,
  getCurrentFilters,
  getTotal,
} = useListing({ listingType: "categoryListing", initialListing: $props.content?.data?.listing})

const { isOpen: isListView, switchState: switchToListView } = useUIState({
  stateName: "PRODUCT_LISTING_STATE",
})

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

const sidebarSelectedFilters = ref({})
const initSidebarFilters = () => {
  sidebarSelectedFilters.value =
    JSON.parse(JSON.stringify(getCurrentFilters.value)) || {}
}

const currentSortingOrder = computed({
  get: () => getCurrentSortingOrder.value,
  set: (order) => changeCurrentSortingOrder(order),
})

const isFilterBarOpen = ref(false)

    

</script>
<template>
  <div v-if="1" class="mx-auto px-4 sm:py-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <div class="bg-white">
  <div>
    <!--
      Mobile filter dialog

      Off-canvas filters for mobile, show/hide based on off-canvas filters state.
    -->
    <div v-if="isFilterBarOpen" class="fixed inset-0 flex z-40 " role="dialog" aria-modal="true">
      <!--
        Off-canvas menu overlay, show/hide based on off-canvas menu state.

        Entering: "transition-opacity ease-linear duration-300"
          From: "opacity-0"
          To: "opacity-100"
        Leaving: "transition-opacity ease-linear duration-300"
          From: "opacity-100"
          To: "opacity-0"
      -->
      <div class="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" @click="isFilterBarOpen = false"></div>

      <!--
        Off-canvas menu, show/hide based on off-canvas menu state.

        Entering: "transition ease-in-out duration-300 transform"
          From: "translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "translate-x-full"
      -->
      
      <div class="hidden mr-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
        <div class="px-4 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Filters</h2>
          <button type="button" @click="isFilterBarOpen = false" class="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400">
            <span class="sr-only">Close menu</span>
            <!-- Heroicon name: outline/x -->
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Filters -->
        <form class="mt-4 border-t border-gray-200">
          <div v-for="filter in getAvailableFilters" :key="filter.id" class="border-t border-gray-200 px-4 py-6">
            <h3 class="-mx-2 -my-3 flow-root">
              <!-- Expand/collapse section button -->
              <button type="button" class="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500" aria-controls="filter-section-mobile-0" aria-expanded="false">
                <span class="font-medium text-gray-900"> {{ filter.label }} </span>
                <span class="ml-6 flex items-center">
                  <!--
                    Expand icon, show/hide based on section open state.

                    Heroicon name: solid/plus-sm
                  -->
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  <!--
                    Collapse icon, show/hide based on section open state.

                    Heroicon name: solid/minus-sm
                  -->
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                </span>
              </button>
            </h3>
            <!-- Filter section, show/hide based on section state. -->
            <div class="pt-6" id="filter-section-mobile-0">
              <div class="space-y-6">
                <div v-for="option in filter.options" :key="option.id" class="flex items-center">
                  <input id="filter-mobile-color-0" name="color[]" value="white" type="checkbox" class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500">
                  <label for="filter-mobile-color-0" class="ml-3 min-w-0 flex-1 text-gray-500"> {{ option.name }} </label>
                </div>

               
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    

    <main class="max-w-7xl mx-auto">
      <div class="relative z-10 flex items-baseline justify-between pt-6 pb-6 border-b border-gray-200">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">{{ category.name }}</h1>

        <div class="flex items-center">
          <div class="relative inline-block text-left">
            <div>
              <button type="button" class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900" id="menu-button" aria-expanded="false" aria-haspopup="true">
                Sort
                <!-- Heroicon name: solid/chevron-down -->
                <svg class="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <div class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
              <div class="py-1" role="none">
                <!--
                  Active: "bg-gray-100", Not Active: ""

                  Selected: "font-medium text-gray-900", Not Selected: "text-gray-500"
                -->
                <button v-for="sorting in getSortingOrders" :key="sorting.key" class="font-medium text-gray-900 block px-4 py-2 text-sm" role="menuitem" tabindex="-1"> {{ sorting.label }} </button>
              </div>
            </div>
          </div>

          <button type="button" class="p-2 -m-2 ml-5 sm:ml-7 text-gray-400 hover:text-gray-500">
            <span class="sr-only">View grid</span>
            <!-- Heroicon name: solid/view-grid -->
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button type="button" class="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500" @click="isFilterBarOpen = true">
            <span class="sr-only">Filters</span>
            <!-- Heroicon name: solid/filter -->
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

    </main>
  </div>
</div>
  </div>
</template>