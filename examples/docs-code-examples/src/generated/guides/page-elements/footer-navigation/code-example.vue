<script setup lang="ts">
import { useNavigation } from "@shopware/composables";
import { getCategoryRoute } from "@shopware/helpers";
const { navigationElements, loadNavigationElements } = useNavigation({
  type: "footer-navigation", // footer-navigation selected
});
loadNavigationElements({
  // invoke an API call to fetch navigation categories
  depth: 1,
});
</script>
<template>
  <Transition>
    <footer v-if="navigationElements.length" class="bg-white dark:bg-gray-900">
      <div class="mx-auto w-full max-w-screen-xl">
        <div class="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
          <div v-for="category in navigationElements" :key="category.id">
            <h2
              class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            >
              {{ category.translated.name }}
            </h2>
            <ul
              class="text-gray-500 dark:text-gray-400 font-medium"
              v-if="category?.childCount"
            >
              <li
                class="mb-4"
                v-for="childCategory in category.children"
                :key="childCategory.id"
              >
                <a
                  :href="getCategoryRoute(childCategory)"
                  class="hover:underline"
                  >{{ childCategory.translated.name }}</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </Transition>
  <style scoped>
    .v-enter-active,
    .v-leave-active {
      transition: opacity 0.5s ease;
    }

    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }
  </style>
</template>
